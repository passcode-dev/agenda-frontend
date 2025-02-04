"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Back from "@/components/back";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodClasse } from "@/lib/schemas/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import ClasseService from "@/lib/service/classeService";
import ClasseForm from "@/components/forms/classeForm";

export default function Editar({ params }) {
    const { id } = use(params);
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(zodClasse),
    });
    const [loading, setLoading] = useState(false);
    const [classe, setClasse] = useState({});
    const { toast } = useToast();
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        const classeService = new ClasseService();
        const editar = await classeService.editarClasse(id, data);
        if (editar.status == "success") {
            setLoading(false);
            reset();
            toast({
                title: "Sucesso",
                description: editar.message,
                variant: "success"
            });
            return router.push("/admin/classes");

        }
        setLoading(false);
        return toast({
            title: "Erro",
            description: editar.data.details,
            variant: "destructive"
        });

    };


    useEffect(() => {
        async function fecthClasses(id) {
            const classeService = new ClasseService();
            const buscar = await classeService.buscarCurso(id);
            if (buscar.status == "success") {
                return setClasse(buscar.data);
            }
            return toast({
                title: "Erro",
                description: buscar.data.details,
                variant: "destructive"
            });
        }
        fecthClasses(id);
    }, [id]);

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin/classes" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Editar Classe
                    </h1>
                    <p className="text-muted-foreground">
                        Preencha os campos abaixo para editar uma classe.
                    </p>
                </div>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ClasseForm register={register} errors={errors} setValue={setValue} initialValues={classe} />
                    <Button type="submit" className="mt-4 w-24" disabled={loading}>
                        {loading ? <Spinner className="text-gray-800" /> : "Editar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}