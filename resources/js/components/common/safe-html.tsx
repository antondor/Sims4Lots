import React from 'react';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { cn } from "@/lib/utils";

type Props = {
    content: string | null | undefined;
    className?: string;
};

export const SafeHtml: React.FC<Props> = ({ content, className }) => {
    if (!content) return null;

    const cleanHtml = DOMPurify.sanitize(content, {
        ADD_ATTR: ['target', 'rel', 'class'],
    });

    return (
        <div className={cn("prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed", className)}>
            {parse(cleanHtml)}
        </div>
    );
};