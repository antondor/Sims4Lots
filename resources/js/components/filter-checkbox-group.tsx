"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import * as React from "react";

type FilterCheckboxProps = {
    values: string[];
};

export function FilterCheckboxGroup({ values }: FilterCheckboxProps) {
    return (
        <div className="flex flex-col gap-3">
            {values.map((value) => (
                <div key={value} className="flex items-center gap-3">
                    <Checkbox id={value} defaultChecked />
                    <Label htmlFor={value}>{value}</Label>
                </div>
            ))}
        </div>
    );
}
