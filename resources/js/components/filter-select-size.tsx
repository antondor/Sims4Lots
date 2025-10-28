import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function FilterSelectSize() {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select lot size" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Lot size</SelectLabel>
                    <SelectItem value="20x15">20x15</SelectItem>
                    <SelectItem value="30x20">30x20</SelectItem>
                    <SelectItem value="40x30">40x30</SelectItem>
                    <SelectItem value="50x50">50x50</SelectItem>
                    <SelectItem value="64x64">64x64</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
