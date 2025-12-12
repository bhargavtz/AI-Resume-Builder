"use client"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableSectionProps {
    id: string;
    children: React.ReactNode;
}

export function DraggableSection({ id, children }: DraggableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group mb-6">
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute -left-8 top-2 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Drag to reorder"
            >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Section Content */}
            <div>
                {children}
            </div>
        </div>
    );
}
