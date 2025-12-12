"use client"
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function KeyboardShortcutsHelp({ open, onOpenChange }: KeyboardShortcutsHelpProps) {
    const shortcuts = [
        { keys: ['Ctrl', 'S'], description: 'Save changes' },
        { keys: ['Ctrl', 'P'], description: 'Preview resume' },
        { keys: ['Ctrl', 'D'], description: 'Download PDF' },
        { keys: ['Ctrl', 'Z'], description: 'Undo last change' },
        { keys: ['Ctrl', 'Y'], description: 'Redo last change' },
        { keys: ['Ctrl', '/'], description: 'Show this help' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Keyboard className="h-5 w-5" />
                        Keyboard Shortcuts
                    </DialogTitle>
                    <DialogDescription>
                        Use these shortcuts to work faster
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">{shortcut.description}</span>
                            <div className="flex gap-1">
                                {shortcut.keys.map((key, i) => (
                                    <React.Fragment key={i}>
                                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                                            {key}
                                        </kbd>
                                        {i < shortcut.keys.length - 1 && (
                                            <span className="text-gray-400">+</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
