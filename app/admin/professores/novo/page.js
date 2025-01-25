"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Back from "@/components/back";
import AlunoService from "@/lib/service/alunoService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodProfessor } from "@/lib/schemas/zod";
import ProfessorForm from "@/components/forms/professorForm";
import ProfessoresService from "@/lib/service/professoresService";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Novo() {
    const [loading, setLoading] = useState(false);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodProfessor),
    });
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        if (data.name && data.birth_date && data.cpf) {
            setLoading(true);
            const professorService = new ProfessoresService();
            const cadastrar = await professorService.cadastrarProfessor(data);
            if (cadastrar.status == "success") {
                reset();
                toast({
                    title: "Professor cadastrado com sucesso",
                    description: cadastrar.message,
                    status: "success",
                });
                setLoading(false);
                return router.push("/admin/professores");
            }
            setLoading(false);
            return toast({
                title: "Erro ao cadastrar professor",
                description: cadastrar.data.details,
                status: "error",
                variant: "destructive"
            });
        }
    };

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
                        Novo Professor
                    </h1>
                    <p className="text-muted-foreground">
                        Cadastre um novo professor
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ProfessorForm register={register} errors={errors} setValue={setValue}  />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                    {loading ? <Spinner className="text-gray-800"  /> : "Cadastrar"}
                    </Button>
                </form>
            </div>
        </div >
    );
}