import * as React from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SelectUI({ placeholder, items, onValueChange }) {
    return (
        <Select onValueChange={onValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {items.map((item, index) => (
                    <SelectItem key={index} value={item}>
                        {item}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}