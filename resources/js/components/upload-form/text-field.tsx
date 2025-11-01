import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function TextField({
                              id,
                              label,
                              value,
                              onChange,
                              placeholder,
                              error,
                              textarea,
                              type = "text",
                          }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
    textarea?: boolean;
    type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}) {
    return (
        <div>
            <Label htmlFor={id} className="mb-2">{label}</Label>
            {textarea ? (
                <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
            ) : (
                <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
            )}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
