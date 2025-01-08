"use client";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import UsuarioForm from "@/components/forms/usuarioForm";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Back from "@/components/back";
import { regexEmail, regexUsername, regexPassword } from "@/lib/regex";

const schema = z.object({
    username: z.string().regex(regexUsername, "Username deve ter pelo menos 3 caracteres (apenas letras, números ou _)"),
    email: z.string().regex(regexEmail, "Deve ser um e-mail válido"),

    password: z
        .string()
        .regex(regexPassword, "Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número"),
});

export default function Novo() {

    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin/usuarios" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Novo Usuário
                    </h1>
                    <p className="text-muted-foreground">
                        Cadastre um novo usuário
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <UsuarioForm register={register} errors={errors} />
                    <Button type="submit" className="mt-4">Cadastrar</Button>
                </form>
            </div>
        </div >
    );
}