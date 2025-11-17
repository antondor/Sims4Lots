"use client";

import * as React from "react";
import { FilterSelectSize } from "@/components/filter-select-size";
import { FilterCheckboxGroup } from "@/components/filter-checkbox-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LotFiltersProps {
    onApply?: (filters: any) => void;
}

type RangeFilters = {
    bedroomsMin: string;
    bedroomsMax: string;
    bathroomsMin: string;
    bathroomsMax: string;
};

export const LotFilters: React.FC<LotFiltersProps> = ({ onApply }) => {
    const [lotType, setLotType] = React.useState<"Residential" | "Community">("Residential");
    const [sizes, setSizes] = React.useState<string[]>([]);
    const [contentTypes, setContentTypes] = React.useState<string[]>([]);
    const [furnishings, setFurnishings] = React.useState<string[]>([]);
    const [filters, setFilters] = React.useState<RangeFilters>({
        bedroomsMin: "",
        bedroomsMax: "",
        bathroomsMin: "",
        bathroomsMax: "",
    });

    const isResidential = lotType === "Residential";

    const handleLotTypeChange = (type: "Residential" | "Community") => {
        setLotType(type);

        if (type !== "Residential") {
            setFilters({
                bedroomsMin: "",
                bedroomsMax: "",
                bathroomsMin: "",
                bathroomsMax: "",
            });
        }
    };

    const handleFilterChange = (field: keyof RangeFilters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleApply = () => {
        onApply?.({
            lotType,
            sizes,
            contentTypes,
            furnishings,
            ...filters,
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                </Button>
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                align="center"
                sideOffset={8}
                collisionPadding={16}
                className="w-[min(100vw-4rem,22rem)] sm:w-auto sm:max-w-md p-4"
            >
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Lot type
                        </div>
                        <div className="flex w-full gap-2">
                            {(["Residential", "Community"] as const).map((type) => (
                                <Button
                                    key={type}
                                    size="sm"
                                    type="button"
                                    variant={lotType === type ? "default" : "outline"}
                                    className="flex-1"
                                    onClick={() => handleLotTypeChange(type)}
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-2">
                        <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Lot size
                        </div>
                        <FilterSelectSize value={sizes} onChange={setSizes} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full">
                        <div className="flex flex-col gap-2">
                            <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Content type
                            </div>
                            <FilterCheckboxGroup
                                values={["CC", "NoCC"]}
                                value={contentTypes}
                                onChange={setContentTypes}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Furnishing
                            </div>
                            <FilterCheckboxGroup
                                values={["Furnished", "Unfurnished"]}
                                value={furnishings}
                                onChange={setFurnishings}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 w-full">
                        <div className="flex flex-col gap-2">
                            <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Bedrooms
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label
                                        htmlFor="bedrooms-min"
                                        className="text-xs text-muted-foreground"
                                    >
                                        From
                                    </Label>
                                    <Input
                                        id="bedrooms-min"
                                        type="number"
                                        min={0}
                                        value={filters.bedroomsMin}
                                        onChange={(e) =>
                                            handleFilterChange("bedroomsMin", e.target.value)
                                        }
                                        disabled={!isResidential}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label
                                        htmlFor="bedrooms-max"
                                        className="text-xs text-muted-foreground"
                                    >
                                        To
                                    </Label>
                                    <Input
                                        id="bedrooms-max"
                                        type="number"
                                        min={0}
                                        value={filters.bedroomsMax}
                                        onChange={(e) =>
                                            handleFilterChange("bedroomsMax", e.target.value)
                                        }
                                        disabled={!isResidential}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Bathrooms
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label
                                        htmlFor="bathrooms-min"
                                        className="text-xs text-muted-foreground"
                                    >
                                        From
                                    </Label>
                                    <Input
                                        id="bathrooms-min"
                                        type="number"
                                        min={0}
                                        value={filters.bathroomsMin}
                                        onChange={(e) =>
                                            handleFilterChange("bathroomsMin", e.target.value)
                                        }
                                        disabled={!isResidential}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label
                                        htmlFor="bathrooms-max"
                                        className="text-xs text-muted-foreground"
                                    >
                                        To
                                    </Label>
                                    <Input
                                        id="bathrooms-max"
                                        type="number"
                                        min={0}
                                        value={filters.bathroomsMax}
                                        onChange={(e) =>
                                            handleFilterChange("bathroomsMax", e.target.value)
                                        }
                                        disabled={!isResidential}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        className="mt-1 w-full"
                        onClick={handleApply}
                    >
                        Apply filters
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
