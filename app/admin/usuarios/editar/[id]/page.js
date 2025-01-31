"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Back from "@/components/back";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodUsuario } from "@/lib/schemas/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import UsuarioForm from "@/components/forms/usuarioForm";
import UsuarioService from "@/lib/service/usuarioService";
import { use, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Editar({ params }) {
    const { id } = use(params);
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(false);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodUsuario),
    });

    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        const usuarioService = new UsuarioService();
        const alterar = await usuarioService.alterarUsuario(id, data);
        if (alterar.status == "success") {
            reset();
            setLoading(false);
            router.push("/admin/usuarios");
            return toast({
                title: "Usuário editado com sucesso",
                description: alterar.message,
                variant: "success"
            });
        }
        setLoading(false);
        return toast({
            title: "Erro ao editar usuário",
            description: alterar.message,
            variant: "destructive"
        });
    };

    useEffect(() => {
        async function fetchUsuario(id) {
            const professorService = new UsuarioService();
            const buscar = await professorService.buscarUsuario(id);
            if (buscar.status == "success") {
                return setUsuario(buscar.data.users[0]);
            }
            return toast({
                title: "Erro ao buscar usuário",
                description: buscar.message,
                variant: "destructive"
            });
        }
        fetchUsuario(id);
    }, [id]);

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
                        Editar Usuário
                    </h1>
                    <p className="text-muted-foreground">
                        Preencha os campos abaixo para editar um usuário.
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <UsuarioForm register={register} errors={errors} setValue={setValue} initialValues={usuario} />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Editar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}