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

export default function Editar({ params }) {
    const { id } = use(params);

    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodMateria),
    });
    const [professores, setProfessores] = useState([]);
    const [professoresMateria, setProfessoresMateria] = useState([]);
    const [loading, setLoading] = useState(false);
    const [materias, setMaterias] = useState({});
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        let obj = {
            name: data.name,
            teachers: professoresMateria.length > 0 ? professoresMateria.map((professor) => {
                return { id: professor.id }
            }) : materias.Teachers,
        }
        const materiaService = new MateriaService();
        const editar = await materiaService.editarMateria(id, obj);
        if (editar.status == "success") {
            setLoading(false);
            reset();
            toast({
                title: "Sucesso",
                description: editar.message,
                variant: "success",
            });
            return router.push("/admin/materias");
        }
        setLoading(false);
        return toast({
            title: "Erro",
            description: editar.data.details,
            variant: "destructive",
        });
    };

    const fetchProfessor = async (page = 1) => {
        const professorService = new ProfessoresService();
        const professores = await professorService.Professores(page);
        setProfessores(professores.data);
    };

    useEffect(() => {
        async function fetchMateria(id) {
            const materiaService = new MateriaService();
            const buscar = await materiaService.buscarMateria(id);
            if (buscar.status === "success") {
                setMaterias(buscar.data);
            } else {
                toast({
                    title: "Erro",
                    description: buscar.data.details,
                    variant: "destructive",
                });
            }
        }
        fetchProfessor();
        fetchMateria(id);
    }, [id]);

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
                        Editar Matéria
                    </h1>
                    <p className="text-muted-foreground">
                        Preencha os campos abaixo para editar uma matéria.
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <MateriaForm
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        professores={professores}
                        initialValues={materias}
                        setProfessoresMateria={setProfessoresMateria}
                        professoresMateria={professoresMateria}
                    />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Editar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
