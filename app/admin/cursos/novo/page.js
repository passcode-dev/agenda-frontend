"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Back from "@/components/back";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodCurso } from "@/lib/schemas/zod";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import TurmaService from "@/lib/service/turmaService";
import GenericSelectForm from "@/components/forms/genericoForm";
import CursoService from "@/lib/service/cursoService";

export default function Novo() {
    const [loading, setLoading] = useState(false);
    const [turmaCurso, setTurmaCurso] = useState([]);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodCurso),
    });
    const { toast } = useToast();
    const router = useRouter();
    const [turmas, setTurmas] = useState([]);

    const onSubmit = async (data) => {
        setLoading(true);
        let obj = {
            ...data,
            classes: turmaCurso.map((turma) => {
                return { id: turma.id }
            }),
        }
        const cursoService = new CursoService();
        const cursos = await cursoService.cadastrarCurso(obj);
        if (cursos.status === "success") {
            setLoading(false);
            toast({
                title: "Sucesso",
                description: cursos.message,
                status: "success",
            });
            return router.push("/admin/cursos");
        };
        setLoading(false);
        return toast({
            title: "Erro",
            description: cursos.data.details,
            status: "error",
        });
    }

    const fetchTurmas = async (page) => {
        const turmaService = new TurmaService();
        const turmas = await turmaService.Turmas(page);
        setTurmas(turmas.data.classes);
    };

    useEffect(() => {
        fetchTurmas();
    }, []);

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin/cursos" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Novo Curso
                    </h1>
                    <p className="text-muted-foreground">
                        Cadastre uma novo curso
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <GenericSelectForm
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        items={turmas}
                        setSelectedItems={setTurmaCurso}
                        selectedItems={turmaCurso}
                        label="Nome do curso"
                        placeholder="Selecione uma turma..."
                        itemName="Classes"
                        searchPlaceholder="Buscar turma..."
                        noItemsMessage="Nenhum turma encontrada."
                        labelSelect="Turmas"
                    />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Cadastrar"}
                    </Button>
                </form>
            </div>
        </div >
    );
}