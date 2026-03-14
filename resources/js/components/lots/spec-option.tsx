interface LotOptionProps {
    text: string;
    value: string | number | null;
}

export function LotOption({ text, value }: LotOptionProps) {
    return (
        <div className="flex flex-col">
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {text}
            </dt>
            <dd className="text-sm text-foreground">{value}</dd>
        </div>
    );
}
