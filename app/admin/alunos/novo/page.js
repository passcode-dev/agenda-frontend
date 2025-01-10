"use client";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import AlunoForm from "@/components/forms/alunoForm";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Back from "@/components/back";
import { regexNome, regexData, regexCpf, regexRg } from "@/lib/regex";
import AlunoService from "@/lib/service/alunoService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodAluno } from "@/lib/schemas/zod";

export default function Novo() {

    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodAluno),
    });
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        if (data.name && data.phone_number && data.birth_date && data.cpf && data.rg) {
            const alunoService = new AlunoService();
            const cadastrar = await alunoService.cadastrarAluno(data);
            if (cadastrar) {
                reset();
                toast({
                    title: "Aluno cadastrado com sucesso",
                    status: "success",
                });
                return router.push("/admin/alunos");
            }
            toast({
                title: "Erro ao cadastrar aluno",
                description: "Por favor, tente novamente",
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
                        Novo Aluno
                    </h1>
                    <p className="text-muted-foreground">
                        Cadastre um novo aluno
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AlunoForm register={register} errors={errors} setValue={setValue} />
                    <Button type="submit" className="mt-4">Cadastrar</Button>
                </form>
            </div>
        </div >
    );
}