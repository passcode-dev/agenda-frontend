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
import { optional } from "zod";
import UsuarioService from "@/lib/service/usuarioService";
import { useEffect, useState } from "react";

export default function Editar({ params }) {
    const [usuario, setUsuario] = useState({});
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodUsuario),
    });

    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        toast({
            title: "Usuário editado com sucesso",
            description: "O usuário foi editado com sucesso.",
            variant: "success"
        });
        router.push("/admin/usuarios");
    };

    useEffect(() => {
        async function fetchUsuario(id) {
            const professorService = new UsuarioService();
            const buscar = await professorService.buscarUsuario(id);
            if (buscar.status == "success") {
                return setUsuario(buscar.data[0]);
            }
            return toast({
                title: "Erro ao buscar usuário",
                description: buscar.message,
                variant: "destructive"
            });
        }
        fetchUsuario(params.id);
    }, []);

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
                    <Button type="submit" className="mt-4">
                        Salvar
                    </Button>
                </form>
            </div>
        </div>
    );
}