"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Back from "@/components/back";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodMateria } from "@/lib/schemas/zod";
import ProfessoresService from "@/lib/service/professoresService";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import MateriaForm from "@/components/forms/materiaForm";
import { Teachers } from "next/font/google";
import MateriaService from "@/lib/service/materiaService";

export default function Novo() {
    const [loading, setLoading] = useState(false);
    const [professoresMateria, setProfessoresMateria] = useState([]);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodMateria),
    });
    const { toast } = useToast();
    const router = useRouter();
    const [professores, setProfessores] = useState([]);

    const onSubmit = async (data) => {
        setLoading(true);
        let obj = {
            ...data,
            teachers: professoresMateria.map((professor) => {
                return { id: professor.id }
            }),
        }
        const materiaService = new MateriaService();
        const materia = await materiaService.cadastrarMateria(obj);
        if (materia.status === "success") {
            setLoading(false);
            toast({
                title: "Matéria cadastrada com sucesso!",
                description: materia.message,
                status: "success",
            });
            return router.push("/admin/materias");
        };
        setLoading(false);
       return toast({
            title: "Erro ao cadastrar matéria!",
            description: materia.message,
            status: "error",
        });
    }

    const fetchProfessor = async (page = 1) => {
        const professorService = new ProfessoresService();
        const professores = await professorService.Professores(page);
        setProfessores(professores.data);
    };

    useEffect(() => {
        fetchProfessor();
    }, []);

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin/materias" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Nova Matéria
                    </h1>
                    <p className="text-muted-foreground">
                        Cadastre uma nova matéria
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <MateriaForm register={register} errors={errors} setValue={setValue} professores={professores} setProfessoresMateria={setProfessoresMateria} professoresMateria={professoresMateria} />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Cadastrar"}
                    </Button>
                </form>
            </div>
        </div >
    );
}