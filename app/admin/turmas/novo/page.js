"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Back from "@/components/back";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { zodMateria } from "@/lib/schemas/zod";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import TurmaService from "@/lib/service/turmaService";
import AlunoService from "@/lib/service/alunoService";
import TurmaForm from "@/components/forms/turmaForm";

export default function Novo() {
    const [loading, setLoading] = useState(false);
    const [alunosMateria, setAlunosMateria] = useState([]);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodMateria),
    });
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1
    const [alunos, setAlunos] = useState([]);

    const onSubmit = async (data) => {
        setLoading(true);
        let obj = {
            ...data,
            students: alunosMateria.map((aluno) => {
                return { id: aluno.id }
            }),
        }
        const turmaService = new TurmaService();
        const turma = await turmaService.cadastrarTurma(obj);
        if (turma.status === "success") {
            setLoading(false);
            toast({
                title: "Sucesso",
                description: turma.message,
                variant: "success",
            });
            return router.push("/admin/turmas");
        };
        setLoading(false);
        return toast({
            title: "Erro",
            description: turma.data.details,
            variant: "destructive",
        });
    }

    const fetchAlunos = async (page) => {
        const alunoService = new AlunoService();
        const alunos = await alunoService.alunos(page);
        setAlunos(alunos.data.students);
    };

    useEffect(() => {
        fetchAlunos(currentPage);
    }, [currentPage]);

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin/turmas" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Nova Turma
                    </h1>
                    <p className="text-muted-foreground">
                        Cadastre uma nova turma
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TurmaForm register={register} errors={errors} setValue={setValue} alunos={alunos} setAlunosMateria={setAlunosMateria} alunosMateria={alunosMateria} />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Cadastrar"}
                    </Button>
                </form>
            </div>
        </div >
    );
}