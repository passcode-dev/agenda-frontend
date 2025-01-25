"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Tables from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";
import MateriaService from "@/lib/service/materiaService";
import { Badge } from "@/components/ui/badge";

export default function Materias() {
    const [loading, setLoading] = useState(false);
    const [materias, setMaterias] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [totalPage, setTotalPage] = useState(3);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const currentPage = Number(searchParams.get("page")) || 1
    const filterSchema = [
        { name: "Nome" },
    ];

    const columns = [
        { headerName: "#", field: "id" },
        { headerName: "Nome", field: "name" },
        {
            headerName: "Professores", field: "name", renderCell: (params) => (
                <div className="flex flex-wrap  gap-1 justify-center">
                    {params.row.Teachers.map((professor, index) => (
                        <Badge className="p-2"
                            key={index}
                        >
                            {professor.name}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            headerName: "Ações",
            field: "acoes",
            renderCell: (params) => (
                <div className="flex justify-center gap-3">
                    <Button size="sm" onClick={() => editarMateria(params.row.id)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => deletarMateria(params.row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const fetchMateria = async (page) => {
        setLoading(true);
        const materiaService = new MateriaService();
        const materias = await materiaService.Materias(page);
        setMaterias(materias.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMateria(currentPage);
    }, [currentPage]);

    const editarMateria = (id) => {
        router.push(`/admin/materias/editar/${id}`);
    };





    const deletarMateria = async (id) => {
        setShowDialog(true);
        setConfirmCallback(() => async () => {
            const materiaService = new MateriaService();
            const deletar = await materiaService.deletarMateria(id);
            if (deletar.status == "success") {
                fetchMateria(currentPage);
                setShowDialog(false);
                return toast({
                    title: "Sucesso",
                    description: deletar.message,
                });
            }
            fetchMateria(currentPage);
            setShowDialog(false);
            return toast({
                title: "Erro",
                description: deletar.message,
            });
        });
    };

    const handlePageChange = (page) => {
        fetchProfessor(page);
    };

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <AlertDialogUI
                title="Confirmação de exclusão"
                description="Deseja realmente deletar esta matéria ?"
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onConfirm={confirmCallback}
            />
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">Matérias</h1>
                    <p className="text-muted-foreground">Lista de matérias cadastrados</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                    <FilterModal filterSchema={filterSchema} />
                    <Link className="flex items-center justify-center" href="/admin/materias/novo">
                        <Button className="px-4 ">Novo Matéria</Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner message="Carregando..." />
                    </div>
                ) : materias.length >= 0 ? (
                    <>
                        <FilterGroup filterSchema={filterSchema} />
                        <Tables data={materias} columns={columns} isSubjects={true} />
                        <div className="mt-4 flex justify-end items-center">
                            <PaginationUI
                                totalPage={totalPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                ) : null
                }
            </div>
        </div >
    );
}