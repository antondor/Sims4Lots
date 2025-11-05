import * as React from "react";
import { useControlledOpt } from "@/hooks/use-controlled";

type Props = {
    values: string[];
    value?: string[];
    onChange?: (v: string[]) => void;
    className?: string;
};

export const FilterCheckboxGroup: React.FC<Props> = ({ values, value, onChange, className }) => {
    const [selected, setSelected] = useControlledOpt<string[]>({ value, defaultValue: [], onChange });

    const toggle = (val: string) => { const next = selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]; setSelected(next); };

    return (
        <div className={className}>
            <div className="flex flex-col gap-2">
                {values.map((v) => {
                    const checked = selected.includes(v);
                    return (
                        <label key={v} className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={checked} onChange={() => toggle(v)} className="h-4 w-4" />
                            <span>{v}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};
