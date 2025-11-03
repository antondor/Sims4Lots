import * as React from "react";

type FilterCheckboxGroupProps = {
    values: string[];                 // доступные опции (лейблы == значения)
    value?: string[];                 // выбранные значения (контролируемо)
    onChange?: (v: string[]) => void; // колбэк
    className?: string;
};

export const FilterCheckboxGroup: React.FC<FilterCheckboxGroupProps> = ({
                                                                            values,
                                                                            value,
                                                                            onChange,
                                                                            className,
                                                                        }) => {
    const [internal, setInternal] = React.useState<string[]>(value ?? []);
    React.useEffect(() => {
        if (value) setInternal(value);
    }, [value]);

    const selected = value ?? internal;

    const toggle = (val: string) => {
        const exists = selected.includes(val);
        const next = exists ? selected.filter((v) => v !== val) : [...selected, val];
        if (onChange) onChange(next);
        else setInternal(next);
    };

    return (
        <div className={className}>
            <div className="flex flex-col gap-2">
                {values.map((v) => {
                    const checked = selected.includes(v);
                    return (
                        <label key={v} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggle(v)}
                                className="h-4 w-4"
                            />
                            <span>{v}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};
