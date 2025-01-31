"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Back from "@/components/back";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodMateria } from "@/lib/schemas/zod";
import ProfessoresService from "@/lib/service/professoresService";
import MateriaService from "@/lib/service/materiaService";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { use } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import MateriaForm from "@/components/forms/materiaForm";
import AlunoService from "@/lib/service/alunoService";
import TurmaService from "@/lib/service/turmaService";
import TurmaForm from "@/components/forms/turmaForm";

export default function Editar({ params }) {
    const { id } = use(params);

    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodMateria),
    });
    const [alunos, setAlunos] = useState([]);
    const [alunosMateria, setAlunosMateria] = useState([]);
    const [loading, setLoading] = useState(false);
    const [turma, setTurma] = useState({});
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        let obj = {
            name: data.name,
            students: alunosMateria.length > 0 ? alunosMateria.map((aluno) => {
                return { id: aluno.id }
            }) : alunos.Students,
        }
        const turmaService = new TurmaService();
        const editar = await turmaService.editarTurma(id, obj);
        if (editar.status == "success") {
            setLoading(false);
            reset();
            toast({
                title: "Sucesso",
                description: editar.message,
                variant: "success",
            });
            return router.push("/admin/turmas");
        }
        setLoading(false);
        return toast({
            title: "Erro",
            description: editar.data.details,
            variant: "destructive",
        });
    };

    const fetchAlunos = async (page = 1) => {
        const alunoService = new AlunoService();
        const alunos = await alunoService.alunos(page);
        setAlunos(alunos.data.students);
    };

    useEffect(() => {
        async function fetchTurmas(id) {
            const turmaService = new TurmaService();
            const buscar = await turmaService.buscarTurma(id);
            if (buscar.status === "success") {
                setTurma(buscar.data);
            } else {
                toast({
                    title: "Erro ao buscar turma",
                    description: buscar.data.details,
                    variant: "destructive",
                });
            }
        }
        fetchAlunos();
        fetchTurmas(id);
    }, [id]);

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
                        Editar Turma
                    </h1>
                    <p className="text-muted-foreground">
                        Preencha os campos abaixo para editar uma Turma.
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TurmaForm
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        alunos={alunos}
                        initialValues={turma}
                        setAlunosMateria={setAlunosMateria}
                        alunosMateria={alunosMateria}
                    />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Editar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
