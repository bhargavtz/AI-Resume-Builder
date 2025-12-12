"use client"
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    // Determine content to initialize editor with
    const content = value;

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Start typing...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none before:h-0',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            // If empty, send empty string to clean up data
            if (editor.isEmpty) {
                if (value !== '') onChange('');
            } else {
                const html = editor.getHTML();
                if (html !== value) {
                    onChange(html);
                }
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none p-3 min-h-[150px] focus:outline-none min-h-[150px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5'
            }
        },
        immediatelyRender: false // Fixes some React 18+ hydration issues
    });

    // Sync external value changes (e.g. from AI) to editor
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (value === '' && editor.isEmpty) return;

            // Only update if content is fundamentally different to avoid loop/cursor jumps
            // For simple cases, just set content.
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="border rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
            <div className="flex flex-wrap gap-1 p-1 border-b bg-muted/30">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 ${editor.isActive('bold') ? 'bg-muted shadow-sm' : 'hover:bg-muted/50'}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                >
                    <Bold className="h-3.5 w-3.5" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 ${editor.isActive('italic') ? 'bg-muted shadow-sm' : 'hover:bg-muted/50'}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                >
                    <Italic className="h-3.5 w-3.5" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 ${editor.isActive('bulletList') ? 'bg-muted shadow-sm' : 'hover:bg-muted/50'}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <List className="h-3.5 w-3.5" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 ${editor.isActive('orderedList') ? 'bg-muted shadow-sm' : 'hover:bg-muted/50'}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Numbered List"
                >
                    <ListOrdered className="h-3.5 w-3.5" />
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
