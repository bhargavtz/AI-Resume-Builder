import { ModernTemplate, modernTemplate } from './modern';
import { ClassicTemplate, classicTemplate } from './classic';
import { MinimalTemplate, minimalTemplate } from './minimal';
import { CreativeTemplate, creativeTemplate } from './creative';
import { TemplateMetadata } from './modern';

export const templates: TemplateMetadata[] = [
    modernTemplate,
    classicTemplate,
    minimalTemplate,
    creativeTemplate
];

export const templateComponents = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    creative: CreativeTemplate
};

export type TemplateId = keyof typeof templateComponents;

export function getTemplate(id: string) {
    return templates.find(t => t.id === id) || modernTemplate;
}

export function getTemplateComponent(id: string) {
    return templateComponents[id as TemplateId] || ModernTemplate;
}

export { ModernTemplate, ClassicTemplate, MinimalTemplate, CreativeTemplate };
export type { TemplateMetadata };
