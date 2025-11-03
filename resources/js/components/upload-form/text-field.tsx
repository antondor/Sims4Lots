import * as React from "react";
import type { HTMLInputTypeAttribute } from "react";

type Props = {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    error?: string;
    textarea?: boolean;
    type?: HTMLInputTypeAttribute;
    disabled?: boolean; // ⬅️ добавили
};

export function TextField({
                              id,
                              label,
                              value,
                              onChange,
                              placeholder,
                              error,
                              textarea,
                              type = "text",
                              disabled = false, // ⬅️ дефолт
                          }: Props) {
    const common = {
        id,
        placeholder,
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange(e.target.value),
        disabled, // ⬅️ пробрасываем
        className:
            "w-full rounded-md border px-3 py-2 text-sm " +
            (disabled ? "opacity-60 cursor-not-allowed " : "") +
            (error ? "border-red-500" : "border-input"),
        "aria-invalid": !!error,
        "aria-describedby": error ? `${id}-error` : undefined,
    };

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>

            {textarea ? (
                <textarea {...(common as any)} rows={4} />
            ) : (
                <input {...(common as any)} type={type} />
            )}

            {error && (
                <p id={`${id}-error`} className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
