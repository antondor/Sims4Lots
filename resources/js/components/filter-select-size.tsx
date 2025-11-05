import * as React from "react";
import { useControlledOpt } from "@/hooks/use-controlled";

type Props = {
    options?: string[];
    value?: string[];
    onChange?: (v: string[]) => void;
    className?: string;
};

const DEFAULT_OPTIONS = ["20x15","30x20","40x30","50x50","64x64"];

export const FilterSelectSize: React.FC<Props> = ({ options = DEFAULT_OPTIONS, value, onChange, className }) => {
    const [selected, setSelected] = useControlledOpt<string[]>({ value, defaultValue: [], onChange });

    const toggle = (opt: string) => { const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]; setSelected(next); };

    return (
        <div className={className}>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                    const active = selected.includes(opt);
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => toggle(opt)}
                            className={[
                                "px-2 py-1 rounded border text-sm transition",
                                active ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted border-border",
                            ].join(" ")}
                            aria-pressed={active}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
