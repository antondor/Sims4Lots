"use client";
import * as React from "react";
import { FilterSelectSize } from "@/components/filter-select-size";
import { FilterCheckboxGroup } from "@/components/filter-checkbox-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LotFiltersProps { onApply?: (filters: any) => void; }

export const LotFilters: React.FC<LotFiltersProps> = ({ onApply }) => {
    const [lotType, setLotType] = React.useState<"Residential" | "Community">("Residential");
    const [sizes, setSizes] = React.useState<string[]>([]);
    const [contentTypes, setContentTypes] = React.useState<string[]>([]);
    const [furnishings, setFurnishings] = React.useState<string[]>([]);
    const [filters, setFilters] = React.useState({ bedroomsMin: "", bedroomsMax: "", bathroomsMin: "", bathroomsMax: "" });
    const isResidential = lotType === "Residential";

    const handleLotTypeChange = (type: "Residential" | "Community") => {
        setLotType(type);
        if (type !== "Residential") setFilters({ bedroomsMin: "", bedroomsMax: "", bathroomsMin: "", bathroomsMax: "" });
    };

    const handleFilterChange = (field: keyof typeof filters, value: string) =>
        setFilters((prev) => ({ ...prev, [field]: value }));

    const handleApply = () => onApply?.({ lotType, sizes, contentTypes, furnishings, ...filters });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[400px] p-4" side="bottom" align="end" sideOffset={8} alignOffset={-40}>
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col w-full">
                        <div className="text-muted-foreground px-1 py-1.5 text-xs uppercase tracking-wide">Lot Size</div>
                        <FilterSelectSize value={sizes} onChange={setSizes} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col w-full">
                            <div className="text-muted-foreground px-1 py-1.5 text-xs uppercase tracking-wide">Content Type</div>
                            <FilterCheckboxGroup values={["CC", "NoCC"]} value={contentTypes} onChange={setContentTypes} />
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="text-muted-foreground px-1 py-1.5 text-xs uppercase tracking-wide">Furnishing</div>
                            <FilterCheckboxGroup values={["Furnished", "Unfurnished"]} value={furnishings} onChange={setFurnishings} />
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="text-muted-foreground px-1 py-1.5 text-xs uppercase tracking-wide">Lot Type</div>
                        <div className="flex gap-3 w-full">
                            {["Residential", "Community"].map((type) => (
                                <Button
                                    key={type}
                                    size="sm"
                                    variant={lotType === type ? "default" : "outline"}
                                    onClick={() => handleLotTypeChange(type as "Residential" | "Community")}
                                    className="flex-1"
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <div className="text-muted-foreground px-1 py-1.5 text-xs uppercase tracking-wide">Bedrooms & Bathrooms</div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="bedrooms-min" className="text-xs text-muted-foreground">Bedrooms (From)</Label>
                                <Input id="bedrooms-min" type="number" placeholder="0" value={filters.bedroomsMin} onChange={(e) => handleFilterChange("bedroomsMin", e.target.value)} disabled={!isResidential} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="bedrooms-max" className="text-xs text-muted-foreground">Bedrooms (To)</Label>
                                <Input id="bedrooms-max" type="number" placeholder="5" value={filters.bedroomsMax} onChange={(e) => handleFilterChange("bedroomsMax", e.target.value)} disabled={!isResidential} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="bathrooms-min" className="text-xs text-muted-foreground">Bathrooms (From)</Label>
                                <Input id="bathrooms-min" type="number" placeholder="0" value={filters.bathroomsMin} onChange={(e) => handleFilterChange("bathroomsMin", e.target.value)} disabled={!isResidential} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="bathrooms-max" className="text-xs text-muted-foreground">Bathrooms (To)</Label>
                                <Input id="bathrooms-max" type="number" placeholder="5" value={filters.bathroomsMax} onChange={(e) => handleFilterChange("bathroomsMax", e.target.value)} disabled={!isResidential} />
                            </div>
                        </div>
                    </div>

                    <Button className="mt-2 w-full" onClick={handleApply}>Apply Filters</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
