import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export default function UsuarioForm({ register, errors, setValue, initialValues }) {

    useEffect(() => {
        if (initialValues) {
            setValue("username", initialValues.username );
            setValue("email", initialValues.email);
        }
    }, [initialValues, setValue])

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                        id="username"
                        type="text"
                        {...register("username")}
                        placeholder="joao_silva"
                    />
                    {errors.username && (<p className="text-red-500 text-sm">*{errors.username.message}</p>)}
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="text"
                        {...register("email")}
                        placeholder="exemplo@dominio.com "
                    />
                    {errors.email && (<p className="text-red-500 text-sm">*{errors.email.message}</p>)}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register("password")}
                    />
                    {errors.password && (<p className="text-red-500 text-sm">*{errors.password.message}</p>)}
                </div>
            </div>
        </div>
    );
}