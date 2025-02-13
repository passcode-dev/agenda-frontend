"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodUsuario } from "@/lib/schemas/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import UsuarioForm from "@/components/forms/usuarioForm";
import UsuarioService from "@/lib/service/usuarioService";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { UserContext } from "@/app/context/userContext";
import { AlertDialogUI } from "@/components/alert";
import { handleLogout } from "@/lib/functions";

export default function Perfil() {
    const { user } = useContext(UserContext);
    const [usuario, setUsuario] = useState({});
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(false);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodUsuario),
    });

    const { toast } = useToast();

    const onSubmit = async (data) => {
        setLoading(true);
        const usuarioService = new UsuarioService();
        const alterar = await usuarioService.alterarUsuario(user.id, data);
        if (alterar.status == "success") {
            setLoading(false);
            setConfirmCallback(() => () => {
                handleLogout();
            });
            return setShowDialog(true);
        }
        setLoading(false);
        return toast({
            title: "Erro",
            description: alterar.data.details,
            variant: "destructive"
        });
    };

    useEffect(() => {
        setUsuario(user);
    }, [user]);

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Editar Perfil
                    </h1>
                    <p className="text-muted-foreground">
                        Preencha os campos abaixo para editar seu perfil.
                    </p>
                </div>
            </div>
            <div>
                <AlertDialogUI
                    title="Atualização de Perfil Necessária"
                    description="Seus dados de perfil foram atualizados com sucesso! Para garantir que todas as mudanças sejam aplicadas corretamente, é necessário fazer login novamente."
                    showDialog={showDialog}
                    setShowDialog={setShowDialog}
                    onConfirm={confirmCallback}
                    hidden={true}
                />
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