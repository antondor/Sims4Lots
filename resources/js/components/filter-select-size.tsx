import * as React from "react";

type FilterSelectSizeProps = {
    options?: string[];           // список размеров, если нужно переопределить
    value?: string[];             // выбранные значения (контролируемо)
    onChange?: (v: string[]) => void; // колбэк при изменении
    className?: string;
};

const DEFAULT_OPTIONS = ["20x15","30x20","40x30","50x50","64x64"];

export const FilterSelectSize: React.FC<FilterSelectSizeProps> = ({
                                                                      options = DEFAULT_OPTIONS,
                                                                      value,
                                                                      onChange,
                                                                      className,
                                                                  }) => {
    // если value не передали — работаем неконтролируемо
    const [internal, setInternal] = React.useState<string[]>(value ?? []);

    // синхронизация при внешнем обновлении value
    React.useEffect(() => {
        if (value) setInternal(value);
    }, [value]);

    const selected = value ?? internal;

    const toggle = (opt: string) => {
        const exists = selected.includes(opt);
        const next = exists ? selected.filter((s) => s !== opt) : [...selected, opt];
        if (onChange) onChange(next);
        else setInternal(next);
    };

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
