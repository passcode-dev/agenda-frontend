"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Back from "@/components/back";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodProfessor } from "@/lib/schemas/zod";
import AlunoService from "@/lib/service/alunoService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ProfessoresService from "@/lib/service/professoresService";
import { use, useEffect, useState } from "react";
import ProfessorForm from "@/components/forms/professorForm";

export default function Editar({ params }) {
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodProfessor),
    });
    const [professor, setProfessor] = useState({});
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        const professorService = new ProfessoresService();
        const editar = await professorService.editarProfessor(params.id, data);
        if (!editar) {
            return toast({
                title: "Erro ao editar aluno",
                description: "Ocorreu um erro ao editar o aluno, tente novamente.",
                variant: "destructive"
            });
        }
        reset();
        toast({
            title: "Aluno editado com sucesso",
            description: "O aluno foi editado com sucesso.",
            variant: "success"
        });
        router.push("/admin/alunos");
    };


    useEffect(() => {
        async function fetchProfessor(id){
            const professorService = new ProfessoresService();
            const buscar = await professorService.buscarProfessor(id);
            if (!buscar) {
                return toast({
                    title: "Erro ao buscar professor",
                    description: "Ocorreu um erro ao buscar o professor, tente novamente.",
                    variant: "destructive"
                });
            }
            setProfessor(buscar);
        }
        fetchProfessor(params.id);
    }, []);

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
                    <Button type="submit" className="mt-4">
                        Salvar
                    </Button>
                </form>
            </div>
        </div>
    );
}