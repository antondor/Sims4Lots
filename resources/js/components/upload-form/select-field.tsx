import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SelectField({
                                label,
                                value,
                                onValueChange,
                                options,
                                error,
                                placeholder = "Select",
                            }: {
    label: string;
    value: string;
    onValueChange: (v: string) => void;
    options: string[];
    error?: string;
    placeholder?: string;
}) {
    return (
        <div>
            <Label className="mb-2">{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                            {opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
