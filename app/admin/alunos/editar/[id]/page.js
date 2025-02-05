"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlunoForm from "@/components/forms/alunoForm";
import Back from "@/components/back";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodAluno } from "@/lib/schemas/zod";
import AlunoService from "@/lib/service/alunoService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Editar({ params }) {
    const [alunos, setAlunos] = useState({});
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodAluno),
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        const alunoService = new AlunoService();
        const editar = await alunoService.editarAluno(params.id, data);
        if (editar.status == "success") {
            setLoading(false);
            reset();
            toast({
                title: "Sucesso",
                description: editar.message,
                variant: "success"
            });
            return router.push('/admin/alunos');
        }
        setLoading(false);
        return toast({
            title: "Erro",
            description: editar.data.details,
            variant: "destructive"
        });
    };

    useEffect(() => {
        async function fetchAlunos(id) {
            const alunoService = new AlunoService();
            const buscar = await alunoService.buscarAluno(id);
            if (buscar.status == "success") {
                return setAlunos(buscar.data[0]);
            }
            return toast({
                title: "Erro ao buscar aluno",
                description: buscar.message,
                variant: "destructive"
            });
        }
        fetchAlunos(params.id);
    }, [params.id])


    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin/alunos" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Editar Aluno
                    </h1>
                    <p className="text-muted-foreground">
                        Preencha os campos abaixo para editar um aluno.
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AlunoForm register={register} errors={errors} setValue={setValue} initialValues={alunos} />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Editar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}