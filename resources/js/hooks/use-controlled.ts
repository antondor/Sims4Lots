import * as React from "react";

type Options<T> = {
    value?: T;
    defaultValue: T;
    onChange?: (v: T) => void;
};

export function useControlledOpt<T>({ value, defaultValue, onChange }: Options<T>) {
    const [state, setState] = React.useState<T>(value ?? defaultValue);

    React.useEffect(() => {
        if (value !== undefined) setState(value);
    }, [value]);

    const set = React.useCallback(
        (v: T) => {
            if (onChange) onChange(v);
            else setState(v);
        },
        [onChange]
    );

    return [value ?? state, set] as const;
}
