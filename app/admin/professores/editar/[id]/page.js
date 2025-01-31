"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Back from "@/components/back";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodProfessor } from "@/lib/schemas/zod";
import AlunoService from "@/lib/service/alunoService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ProfessoresService from "@/lib/service/professoresService";
import { use, useEffect, useState } from "react";
import ProfessorForm from "@/components/forms/professorForm";
import { Spinner } from "@/components/ui/spinner";

export default function Editar({ params }) {
    const { id } = use(params);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodProfessor),
    });
    const [loading, setLoading] = useState(false);
    const [professor, setProfessor] = useState({});
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        const professorService = new ProfessoresService();
        const editar = await professorService.editarProfessor(id, data);
        if (editar.status == "success") {
            setLoading(false);
            reset();
            toast({
                title: "Professor editado com sucesso",
                description: editar.message,
                variant: "success"
            });
            return router.push("/admin/professores");

        }
        setLoading(false);
        return toast({
            title: "Erro ao editar professor",
            description: editar.data.details,
            variant: "destructive"
        });

    };


    useEffect(() => {
        async function fetchProfessor(id) {
            const professorService = new ProfessoresService();
            const buscar = await professorService.buscarProfessor(id);
            if (buscar.status == "success") {
                return setProfessor(buscar.data.teachers[0]);
            }
            return toast({
                title: "Erro ao buscar professor",
                description: buscar.data.details,
                variant: "destructive"
            });
        }
        fetchProfessor(id);
    }, [id]);

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin/professores" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Editar Professor
                    </h1>
                    <p className="text-muted-foreground">
                        Preencha os campos abaixo para editar um professor.
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ProfessorForm register={register} errors={errors} setValue={setValue} initialValues={professor} />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Editar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}