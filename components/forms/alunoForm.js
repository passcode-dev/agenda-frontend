"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { maskCpf, maskPhone, maskRg } from "@/lib/mask";

export default function AlunoForm({ register, errors, setValue, initialValues }) {
    useEffect(() => {
        if (initialValues) {
            setValue("name", initialValues.name);
            setValue("birth_date", initialValues.birth_date);
            setValue("cpf", maskCpf(initialValues.cpf));
            setValue("rg", maskRg(initialValues.rg));
            setValue("phone_number", maskPhone(initialValues.phone_number));
            setValue("inital_date", initialValues.inital_date);
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
                        placeholder="João"
                    />
                    {errors.name && (<p className="text-red-500 text-sm">*{errors.name.message}</p>)}
                </div>

                <div>
                    <Label htmlFor="sobrenome">Sobrenome</Label>
                    <Input
                        id="sobrenome"
                        type="text"
                        {...register("last_name")}
                        placeholder="Silva"
                    />
                    {errors.last_name && (<p className="text-red-500 text-sm">*{errors.last_name.message}</p>)}
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
                <div>
                    <Label htmlFor="rg">RG</Label>
                    <Input
                        id="rg"
                        type="text"
                        {...register("rg")}
                        placeholder="00.000.000-0"
                        onChange={(e) => setValue("rg", maskRg(e.target.value))}
                    />
                    {errors.rg && (<p className="text-red-500 text-sm">*{errors.rg.message}</p>)}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                <div>
                    <Label htmlFor="birth_date">Data de Nascimento</Label>
                    <Input
                        id="birth_date"
                        type="date"
                        {...register("birth_date")}
                    />
                    {errors.birth_date && (<p className="text-red-500 text-sm">*{errors.birth_date.message}</p>)}
                </div>
                <div>
                    <Label htmlFor="phone_number">Telefone</Label>
                    <Input
                        id="phone_number"
                        type="text"
                        {...register("phone_number")}
                        placeholder="+55 (00) 00000-0000"
                        onChange={(e) => setValue("phone_number", maskPhone(e.target.value))}
                    />
                    {errors.phone_number && (<p className="text-red-500 text-sm">*{errors.phone_number.message}</p>)}
                </div>

            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">

                <div>
                    <Label htmlFor="entry_date">Data de Início</Label>
                    <Input
                        id="entry_date"
                        type="date"
                        {...register("entry_date")}
                    />
                    {errors.entry_date && (<p className="text-red-500 text-sm">*{errors.entry_date.message}</p>)}
                </div>
                <div>
                    <Label htmlFor="exit_date">Data de Saída</Label>
                    <Input
                        id="exit_date"
                        type="date"
                        {...register("exit_date")}
                    />
                    {errors.exit_date && (<p className="text-red-500 text-sm">*{errors.exit_date.message}</p>)}
                </div>
            </div>
        </div>
    );
}
