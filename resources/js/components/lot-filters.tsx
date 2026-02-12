"use client";

import * as React from "react";
import { SlidersHorizontal, X, ArrowDownUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FilterSelectSize } from "@/components/filter-select-size";

interface LotFiltersProps {
    initialFilters?: any;
    onApply?: (filters: any) => void;
}

type RangeFilters = {
    bedroomsMin: string;
    bedroomsMax: string;
    bathroomsMin: string;
    bathroomsMax: string;
};

const initialRange: RangeFilters = {
    bedroomsMin: "",
    bedroomsMax: "",
    bathroomsMin: "",
    bathroomsMax: "",
};

function useMediaQuery(query: string) {
    const [value, setValue] = React.useState(false);
    React.useEffect(() => {
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches);
        }
        const result = matchMedia(query);
        result.addEventListener("change", onChange);
        setValue(result.matches);
        return () => result.removeEventListener("change", onChange);
    }, [query]);
    return value;
}

const ToggleChip = ({
    label,
    isActive,
    onClick
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            isActive
                ? "border-primary bg-primary text-primary-foreground hover:bg-primary/80"
                : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        )}
    >
        {label}
    </button>
);

export const LotFilters: React.FC<LotFiltersProps> = ({ onApply, initialFilters }) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // --- State ---
    const [sort, setSort] = React.useState<string>(initialFilters?.sort || "newest");
    const [source, setSource] = React.useState<string>(initialFilters?.source || "all");
    const [lotType, setLotType] = React.useState<string | null>(initialFilters?.lotType || null);

    const [sizes, setSizes] = React.useState<string[]>(initialFilters?.sizes || []);
    const [contentTypes, setContentTypes] = React.useState<string[]>(initialFilters?.contentTypes || []);
    const [furnishings, setFurnishings] = React.useState<string[]>(initialFilters?.furnishings || []);

    const [filters, setFilters] = React.useState<RangeFilters>({
        bedroomsMin: initialFilters?.bedroomsMin || "",
        bedroomsMax: initialFilters?.bedroomsMax || "",
        bathroomsMin: initialFilters?.bathroomsMin || "",
        bathroomsMax: initialFilters?.bathroomsMax || "",
    });

    const showRooms = lotType !== "Community";

    const activeFiltersCount = [
        sizes.length > 0,
        contentTypes.length > 0,
        furnishings.length > 0,
        Object.values(filters).some(v => v !== ""),
        lotType !== null,
        sort !== "newest",
        source !== "all"
    ].filter(Boolean).length;

    const toggleSelection = (list: string[], item: string, setList: (l: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleFilterChange = (field: keyof RangeFilters, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setSort("newest");
        setSource("all");
        setLotType(null);
        setSizes([]);
        setContentTypes([]);
        setFurnishings([]);
        setFilters(initialRange);
    };

    const handleApply = () => {
        onApply?.({
            sort,
            source: source === "all" ? null : source,
            lotType,
            sizes,
            contentTypes,
            furnishings,
            ...filters,
        });
        setOpen(false);
    };

    const renderFilterBody = (scrollableClass: string) => (
        <>
            <div className={cn("space-y-6", scrollableClass)}>

                {/* --- 1. SORTING & SOURCE --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase text-muted-foreground flex items-center gap-1">
                            <ArrowDownUp className="h-3 w-3" /> Sort by
                        </Label>
                        <Select value={sort} onValueChange={setSort}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sort order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest first</SelectItem>
                                <SelectItem value="popular">Most Popular</SelectItem>
                                <SelectItem value="oldest">Oldest first</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs uppercase text-muted-foreground flex items-center gap-1">
                            <Download className="h-3 w-3" /> Source
                        </Label>
                        <Select value={source} onValueChange={setSource}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Any source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any source</SelectItem>
                                <SelectItem value="file">Direct Link</SelectItem>
                                <SelectItem value="gallery">EA Gallery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator />

                {/* --- 2. LOT TYPE --- */}
                <div className="space-y-2">
                    <Label className="text-xs uppercase text-muted-foreground">Category</Label>
                    <div className="grid grid-cols-3 p-1 bg-muted rounded-lg gap-1">
                        {[
                            { label: "All", value: null },
                            { label: "Residential", value: "Residential" },
                            { label: "Community", value: "Community" }
                        ].map((type) => (
                            <button
                                key={type.label}
                                type="button"
                                onClick={() => {
                                    setLotType(type.value);
                                    if (type.value === "Community") setFilters(initialRange);
                                }}
                                className={cn(
                                    "flex items-center justify-center py-1.5 text-sm font-medium rounded-md transition-all",
                                    lotType === type.value
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- 3. CHIPS --- */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase text-muted-foreground">Details</Label>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {["CC", "NoCC"].map(val => (
                                <ToggleChip
                                    key={val}
                                    label={val}
                                    isActive={contentTypes.includes(val)}
                                    onClick={() => toggleSelection(contentTypes, val, setContentTypes)}
                                />
                            ))}
                            <div className="w-px h-6 bg-border mx-1 self-center" />
                            {["Furnished", "Unfurnished"].map(val => (
                                <ToggleChip
                                    key={val}
                                    label={val}
                                    isActive={furnishings.includes(val)}
                                    onClick={() => toggleSelection(furnishings, val, setFurnishings)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs uppercase text-muted-foreground">Lot Size</Label>
                        <FilterSelectSize value={sizes} onChange={setSizes} />
                    </div>
                </div>

                {/* --- 4. ROOMS (Residential OR All) --- */}
                <div className={cn("space-y-3 transition-opacity duration-200", !showRooms && "opacity-40 pointer-events-none")}>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase text-muted-foreground">Bedrooms</Label>
                            <div className="flex items-center gap-1.5">
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    className="h-9 px-2 text-center"
                                    value={filters.bedroomsMin}
                                    onChange={(e) => handleFilterChange("bedroomsMin", e.target.value)}
                                />
                                <span className="text-muted-foreground text-xs">—</span>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Max"
                                    className="h-9 px-2 text-center"
                                    value={filters.bedroomsMax}
                                    onChange={(e) => handleFilterChange("bedroomsMax", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs uppercase text-muted-foreground">Bathrooms</Label>
                            <div className="flex items-center gap-1.5">
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Min"
                                    className="h-9 px-2 text-center"
                                    value={filters.bathroomsMin}
                                    onChange={(e) => handleFilterChange("bathroomsMin", e.target.value)}
                                />
                                <span className="text-muted-foreground text-xs">—</span>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Max"
                                    className="h-9 px-2 text-center"
                                    value={filters.bathroomsMax}
                                    onChange={(e) => handleFilterChange("bathroomsMax", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    const TriggerButton = (
        <Button
            variant="outline"
            className="relative border-dashed bg-background hover:bg-accent/50"
        >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters

            {activeFiltersCount > 0 && (
                <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground hover:bg-primary/90"
                >
                    {activeFiltersCount}
                </Badge>
            )}
        </Button>
    );

    // --- DESKTOP VIEW (Popover) ---
    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
                <PopoverContent className="w-[360px] p-0" align="start" sideOffset={8}>
                    <div className="flex flex-col h-full max-h-[80vh]">
                        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-muted/10">
                            <span className="text-sm font-semibold flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" /> Filters
                            </span>
                            {activeFiltersCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive transition-colors"
                                    onClick={handleReset}
                                >
                                    Reset all
                                    <X className="ml-1 h-3 w-3" />
                                </Button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
                            {renderFilterBody("")}
                        </div>

                        <div className="p-4 border-t bg-muted/20 shrink-0">
                            <Button className="w-full" onClick={handleApply}>
                                Show results
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    }

    // --- MOBILE VIEW (Drawer) ---
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
            <DrawerContent className="max-h-[90vh]">
                <DrawerHeader className="text-left border-b pb-4">
                    <DrawerTitle>Filters & Sort</DrawerTitle>
                </DrawerHeader>

                <div className="px-4 overflow-y-auto py-6">
                    {renderFilterBody("pb-20")}
                </div>

                <DrawerFooter className="pt-2 border-t bg-background">
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={handleReset}>Reset</Button>
                        <Button onClick={handleApply}>Apply ({activeFiltersCount})</Button>
                    </div>
                    <DrawerClose asChild>
                        <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground mt-2">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
