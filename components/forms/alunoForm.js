import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export default function AlunoForm({ register, errors, setValue, initialValues }) {

    useEffect(() => {
        if (initialValues) {
            setValue("name", initialValues.name);
            setValue("birth_date", initialValues.birth_date);
            setValue("cpf", initialValues.cpf);
            setValue("rg", initialValues.rg);
            setValue("phone_number", initialValues.phone_number);
        }
    }, []);

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
                    {errors.dataNascimento && (<p className="text-red-500 text-sm">*{errors.dataNascimento.message}</p>)}
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
                    />
                    {errors.rg && (<p className="text-red-500 text-sm">*{errors.rg.message}</p>)}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                <div>
                    <Label htmlFor="phone_number">Telefone</Label>
                    <Input
                        id="phone_number"
                        type="text"
                        {...register("phone_number")}
                        placeholder="(00) 00000-0000"
                    />
                    {errors.phone_number && (<p className="text-red-500 text-sm">*{errors.phone_number.message}</p>)}
                </div>
            </div>
        </div>
    );
}