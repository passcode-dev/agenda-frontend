"use client";
import Back from "@/components/back";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import ProfessoresService from "@/lib/service/professoresService";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Tables from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";

export default function Professores() {
    const [loading, setLoading] = useState(false);
    const [professores, setProfessores] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [totalPage, setTotalPage] = useState(3);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const currentPage = Number(searchParams.get("page")) || 1
    const filterSchema = [
        { name: "Data de Nascimento", Value: <input /> },
        { name: "Nome" },
        { name: "CPF" },
    ];

    const columns = [
        { headerName: "#", field: "id" },
        { headerName: "Nome", field: "name" },
        { headerName: "CPF", field: "cpf" },
        {
            headerName: "Data de Nascimento",
            field: "birth_date",
            renderCell: ({ row }) =>
                new Date(row.birth_date).toLocaleDateString("pt-BR"),
        },
        {
            headerName: "Ações",
            field: "acoes",
            renderCell: (params) => (
                <div className="flex justify-center gap-3">
                    <Button size="sm" onClick={() => editarProfessor(params.row.id)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => deletarProfessor(params.row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const fetchProfessor = async (page) => {
        setLoading(true);
        const professorService = new ProfessoresService();
        const professores = await professorService.Professores(page);
        setProfessores(professores);
        setLoading(false);
    };

    useEffect(() => {
        fetchProfessor(currentPage);
    }, [currentPage]);

    const editarProfessor = (id) => {
        router.push(`/admin/professores/editar/${id}`);
    };

    const deletarProfessor = async (id) => {
        setShowDialog(true);
        setConfirmCallback(() => async () => {
            const professorService = new ProfessoresService();
            const deletar = await professorService.deletarProfessor(id);
            if (deletar.status == "success") {
                setShowDialog(false);
                fetchProfessor(currentPage);
                return toast({
                    title: "Sucesso",
                    description: deletar.message,
                });
            }
            setShowDialog(false);
            fetchProfessor(currentPage);
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
                description="Deseja realmente deletar este professor?"
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onConfirm={confirmCallback}
            />
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">Professores</h1>
                    <p className="text-muted-foreground">Lista de professores cadastrados</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                    <FilterModal filterSchema={filterSchema} />
                    <Link className="flex items-center justify-center" href="/admin/professores/novo">
                        <Button className="px-4 ">Novo Professor</Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner message="Carregando..." />
                    </div>
                ) : professores.length >= 0 ? (
                    <>
                        <FilterGroup filterSchema={filterSchema} />
                        <Tables data={professores} columns={columns} />
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