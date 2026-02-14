import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, Quote, Code, List, ListOrdered, Undo, Redo, Check, X, Unlink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from 'react'

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
}

export function RichTextEditor({ value, onChange, className, error }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-[150px] w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            if (editor.getText() === '' && value === '') return;
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    return (
        <div className={cn("flex flex-col rounded-md border border-input shadow-sm bg-transparent", error && "border-red-500", className)}>
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/20 p-1">
                <Button
                    type="button" variant="ghost" size="icon" className={cn("h-8 w-8", editor.isActive('bold') && "bg-muted text-primary")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button" variant="ghost" size="icon" className={cn("h-8 w-8", editor.isActive('italic') && "bg-muted text-primary")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button" variant="ghost" size="icon" className={cn("h-8 w-8", editor.isActive('underline') && "bg-muted text-primary")}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="mx-1 h-5" />

                <Button
                    type="button" variant="ghost" size="icon" className={cn("h-8 w-8", editor.isActive('bulletList') && "bg-muted text-primary")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button" variant="ghost" size="icon" className={cn("h-8 w-8", editor.isActive('orderedList') && "bg-muted text-primary")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="mx-1 h-5" />

                <Button
                    type="button" variant="ghost" size="icon" className={cn("h-8 w-8", editor.isActive('blockquote') && "bg-muted text-primary")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                
                <div className="ml-auto flex items-center gap-1">
                     <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().undo().run()}>
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => editor.chain().focus().redo().run()}>
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <EditorContent editor={editor} />
        </div>
    )
}