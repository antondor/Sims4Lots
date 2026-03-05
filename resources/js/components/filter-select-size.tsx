import * as React from "react";
import { useControlledOpt } from "@/hooks/use-controlled";
import { LOT_SIZES } from "@/constants/lots";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    options?: string[];
    value?: string[];
    onChange?: (v: string[]) => void;
    className?: string;
};

const DEFAULT_OPTIONS = LOT_SIZES as unknown as string[];

export const FilterSelectSize: React.FC<Props> = ({ options = DEFAULT_OPTIONS, value, onChange, className }) => {
    const [selected, setSelected] = useControlledOpt<string[]>({
        value,
        defaultValue: [],
        onChange,
    });
    const [open, setOpen] = React.useState(false);

    const toggle = (opt: string) => {
        const next = selected.includes(opt)
            ? selected.filter((s) => s !== opt)
            : [...selected, opt];
        setSelected(next);
    };

    const label =
        selected.length === 0
            ? "All sizes"
            : selected.length === 1
                ? selected[0]
                : `${selected.length} sizes selected`;

    return (
        <div className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        <span className="truncate text-left">{label}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Filter sizes..." />
                        <CommandEmpty>No sizes found.</CommandEmpty>
                        <CommandList>
                            {options.map((opt) => {
                                const active = selected.includes(opt);
                                return (
                                    <CommandItem
                                        key={opt}
                                        value={opt}
                                        onSelect={() => toggle(opt)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                active ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {opt}
                                    </CommandItem>
                                );
                            })}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
