"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export default function ClasseForm({ register, errors, setValue, initialValues }) {

    useEffect(() => {
        if (initialValues) {
            setValue("name", initialValues.name);
        }
    }, [initialValues, setValue]);


    return (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="Classe A"
                    />
                    {errors.name && (<p className="text-red-500 text-sm">*{errors.name.message}</p>)}
                </div>
            </div>
        </div>
    );
}