"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import AuthService from "@/lib/service/authService";
import { useRouter } from "next/navigation";
import { regexEmail, regexUsername } from "@/lib/regex";
import { UserContext } from "./context/userContext";

const schema = z.object({
    emailOrUsername: z.string().refine((value) => {
        const isEmail = regexEmail.test(value);
        const isUsername = regexUsername.test(value);
        return isEmail || isUsername;
    }, {
        message: "Deve ser um e-mail válido ou um username válido",
    }),
    password: z
        .string().min(1, "O campo senha é obrigatório"),
});

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });
    const { toast } = useToast();
    const router = useRouter();
    const { setUser } = useContext(UserContext);

    const onSubmit = async (data) => {
        setLoading(true);

        if (data.emailOrUsername && data.password) {
            const authService = new AuthService();
            const login = await authService.login(data);
            if (login) {
                localStorage.setItem("usuario", JSON.stringify(login.data));
                setUser(login.data);
                reset();
                toast({
                    title: "Login efetuado com sucesso",
                    description: "Você será redirecionado para a página inicial",
                    status: "success",
                });
                router.push("/admin");
                setLoading(false);
            } else {
                toast({
                    title: "Email e/ou username ou senha inválidos",
                    description: "Por favor, tente novamente",
                    status: "error",
                    variant: "destructive"
                });
                setLoading(false);
            }
        }
        setLoading(false);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Login</h1>
                    <p className="mt-2 ">
                        Acesse sua conta para continuar
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" >Email e/ou Username</Label>
                            <Input
                                id="email"
                                type="text"
                                {...register("emailOrUsername")}
                                className="bg-gray-800 border-gray-700 text-white"
                                placeholder="exemplo@dominio.com ou username"
                            />
                            {errors.emailOrUsername && (<p className="text-red-500 text-sm">*{errors.emailOrUsername.message}</p>)}
                        </div>

                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                            {errors.password && (<p className="text-red-500 text-sm">*{errors.password.message}</p>)}
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Entrar"}
                    </Button>
                </form>
            </div>
        </main >
    );
}