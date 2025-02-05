"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function GenericSelectForm({
    register,
    errors,
    setValue,
    items,
    initialValues,
    setSelectedItems,
    selectedItems,
    label,
    placeholder,
    itemName,
    searchPlaceholder,
    noItemsMessage,
    labelSelect
}) {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (initialValues) {
            setValue("name", initialValues.name);
            setSelectedItems(initialValues[itemName]);
        }
    }, [initialValues, setValue, itemName, setSelectedItems]);

    const handleAddItem = (itemId) => {
        const selectedItem = items.find((item) => item.id === itemId);
        if (selectedItem && !selectedItems.some((item) => item.id === selectedItem.id)) {
            setSelectedItems((prev) => [...prev, selectedItem]);
        }
        setSearchTerm("");
    };

    const filteredItems = searchTerm
        ? items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : items;

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label>{label}</Label>
                    <Input
                        type="text"
                        {...register("name")}
                    />
                    {errors.name && (<p className="text-red-500 text-sm">*{errors.name.message}</p>)}
                </div>
                <div>
                    <Label>{labelSelect}</Label>
                    <Select onValueChange={handleAddItem}>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                            <Input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-2"
                            />
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="p-2 text-gray-500">{noItemsMessage}</p>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col flex-wrap gap-2 mt-4">
                <Label>Selecionados</Label>
                <div className="flex flex-wrap gap-2">
                    {selectedItems?.length > 0 ? (
                        selectedItems.map((item) => (
                            <Badge key={item.id} className="flex items-center gap-2 justify-between p-2">
                                <span>{item.name}</span>
                                <button
                                    onClick={() =>
                                        setSelectedItems((prev) =>
                                            prev.filter((selected) => selected.id !== item.id)
                                        )
                                    }
                                >
                                    <X size={16} />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-gray-800">Nenhum item adicionado</p>
                    )}
                </div>
            </div>
        </div>
    );
}
