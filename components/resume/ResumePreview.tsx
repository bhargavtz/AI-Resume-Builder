"use client"
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'
import { getTemplateComponent } from '@/lib/templates'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummaryPreview from './preview/SummaryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationPreview from './preview/EducationPreview'
import SkillsPreview from './preview/SkillsPreview'
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { DraggableSection } from './DraggableSection'

function ResumePreview({ templateId }: { templateId?: string }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

    // Default section order
    const defaultOrder = ['summary', 'experience', 'education', 'skills'];
    const sectionOrder = resumeInfo?.sectionOrder || defaultOrder;

    // Configure sensors for better drag experience
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sectionOrder.indexOf(active.id as string);
            const newIndex = sectionOrder.indexOf(over.id as string);

            const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);

            setResumeInfo({
                ...resumeInfo,
                sectionOrder: newOrder
            });
        }
    };

    // Use template if specified, otherwise use default preview
    if (templateId && templateId !== 'default') {
        const TemplateComponent = getTemplateComponent(templateId);
        return (
            <div id="resume-preview" className="shadow-lg h-full">
                <TemplateComponent resumeInfo={resumeInfo} />
            </div>
        );
    }

    // Section components mapping
    const sectionComponents: Record<string, React.ReactNode> = {
        summary: <SummaryPreview />,
        experience: <ExperiencePreview />,
        education: <EducationPreview />,
        skills: <SkillsPreview />,
    };

    // Default preview (original design) with drag-and-drop
    return (
        <div
            id="resume-preview"
            className='shadow-lg h-full p-14 border-t-[20px] bg-white relative'
            style={{
                borderColor: resumeInfo?.themeColor
            }}
        >
            {/* Personal Detail - Fixed at top */}
            <PersonalDetailPreview resumeInfo={resumeInfo} />

            {/* Draggable Sections */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    {sectionOrder.map((sectionId) => (
                        <DraggableSection key={sectionId} id={sectionId}>
                            {sectionComponents[sectionId]}
                        </DraggableSection>
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default ResumePreview
