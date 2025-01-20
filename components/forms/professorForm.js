"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { maskCpf } from '@/lib/mask';

export default function ProfessorForm({ register, errors, setValue, initialValues}) {

    useEffect(() => {
        if (initialValues) {
            console.log(initialValues);
            setValue("name", initialValues.name);
            setValue("birth_date", initialValues.birth_date);
            setValue("cpf", initialValues.cpf);
        }
    }, [initialValues, setValue]);


    return (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                        id="name"
                        type="text"
                        {...register("name")}
                        placeholder="João da Silva"
                    />
                    {errors.name && (<p className="text-red-500 text-sm">*{errors.name.message}</p>)}
                </div>

                <div>
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                        id="birth_date"
                        type="date"
                        {...register("birth_date")}
                    />
                    {errors.birth_date && (<p className="text-red-500 text-sm">*{errors.birth_date.message}</p>)}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                        id="cpf"
                        type="text"
                        {...register("cpf")}
                        placeholder="000.000.000-00"
                        onChange={(e) => setValue("cpf", maskCpf(e.target.value))}
                    />
                    {errors.cpf && (<p className="text-red-500 text-sm">*{errors.cpf.message}</p>)}
                </div>
            </div>
        </div>
    );
}