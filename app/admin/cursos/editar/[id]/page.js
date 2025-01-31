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
import CursoService from "@/lib/service/cursoService";
import GenericSelectForm from "@/components/forms/genericoForm";
import TurmaService from "@/lib/service/turmaService";

export default function Editar({ params }) {
    const { id } = use(params);

    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodMateria),
    });
    const [turmas, setTurmas] = useState([]);
    const [cursosTurma, setCursosTurma] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cursos, setCursos] = useState({});
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        let obj = {
            name: data.name,
            classes: cursosTurma.length > 0 ? cursosTurma.map((turma) => {
                return { id: turma.id }
            }) : cursos.Classes,
        }
        const cursoService = new CursoService();
        const editar = await cursoService.editarCurso(id, obj);
        if (editar.status == "success") {
            setLoading(false);
            reset();
            toast({
                title: "Sucesso",
                description: editar.message,
                variant: "success",
            });
            return router.push("/admin/cursos");
        }
        setLoading(false);
        return toast({
            title: "Erro",
            description: editar.data.details,
            variant: "destructive",
        });
    };

    const fetchTurmas = async (page = 1) => {
        const turmaService = new TurmaService();
        const turmas = await turmaService.Turmas(page);
        setTurmas(turmas.data.classes);
    };

    useEffect(() => {
        async function fetchCursos(id) {
            const cursoService = new CursoService();
            const buscar = await cursoService.buscarCurso(id);
            if (buscar.status === "success") {
                setCursos(buscar.data);
            } else {
                toast({
                    title: "Erro ao buscar turmas",
                    description: buscar.data.details,
                    variant: "destructive",
                });
            }
        }
        fetchTurmas();
        fetchCursos(id);
    }, [id]);

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
                        Editar Curso
                    </h1>
                    <p className="text-muted-foreground">
                        Preencha os campos abaixo para editar um curso.
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <GenericSelectForm
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        initialValues={cursos}
                        items={turmas}
                        setSelectedItems={setCursosTurma}
                        selectedItems={cursosTurma}
                        label="Curso"
                        placeholder="Selecione uma turma..."
                        itemName="Classes"
                        searchPlaceholder="Buscar turma..."
                        noItemsMessage="Nenhum turma encontrada."
                        labelSelect="Turmas"
                    />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Editar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
