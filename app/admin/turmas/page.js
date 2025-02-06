"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import { Pencil, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Tables from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";
import { Badge } from "@/components/ui/badge";
import TurmaService from "@/lib/service/turmaService";

export default function Turmas() {
    const [loading, setLoading] = useState(false);
    const [turmas, setTurmas] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [totalPage, setTotalPage] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const currentPage = Number(searchParams.get("page")) || 1
    const filterSchema = [
        { name: "Nome", parameterName: "name", icon: <UserRound />, }
    ];

    const columns = [
        { headerName: "#", field: "id" },
        { headerName: "Turma", field: "name" },
        {
            headerName: "Alunos", field: "name", renderCell: (params) => (
                <div className="flex flex-wrap  gap-1 justify-center">
                    {params.row.Students.map((aluno, index) => (
                        <Badge className="p-2"
                            key={index}
                        >
                            {aluno.name}
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
                    <Button size="sm" onClick={() => deletarTurma(params.row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const fetchTurmas = async (page) => {
        setLoading(true);
        try {
            const turmaService = new TurmaService();
            const turmas = await turmaService.Turmas(page);
            setTurmas(turmas.data.classes);
            setTotalPage(Math.ceil(turmas.data.total_records / 10));
            setLoading(false);
        }
        catch (error) {
            setLoading(false);
            return toast({
                title: "Erro",
                description: error.message,
            });
        }
    }


    useEffect(() => {
        fetchTurmas(currentPage);
    }, [currentPage]);

    const editarMateria = (id) => {
        router.push(`/admin/turmas/editar/${id}`);
    };

    const deletarTurma = async (id) => {
        setShowDialog(true);
        setConfirmCallback(() => async () => {
            const turmaService = new TurmaService();
            const deletar = await turmaService.deletarTurma(id);
            if (deletar.status == "success") {
                fetchTurmas(currentPage);
                setShowDialog(false);
                return toast({
                    title: "Sucesso",
                    description: deletar.message,
                });
            }
            fetchTurmas(currentPage);
            setShowDialog(false);
            return toast({
                title: "Erro",
                description: deletar.message,
            });
        });
    };

    const handlePageChange = (page) => {
        fetchTurmas(page);
    };

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <AlertDialogUI
                title="Confirmação de exclusão"
                description="Deseja realmente deletar esta turma?"
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onConfirm={confirmCallback}
            />
            <div className="container max-w-4xl mx-auto p-6">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="mt-4 text-3xl font-bold">Turmas</h1>
                        <p className="text-muted-foreground">Lista de turmas cadastrados</p>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2">
                        <FilterModal filterSchema={filterSchema} />
                        <Link className="flex items-center justify-center" href="/admin/turmas/novo">
                            <Button className="px-4">Nova Turma</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner message="Carregando..." />
                    </div>
                ) : turmas.length >= 0 ? (
                    <>
                        <FilterGroup filterSchema={filterSchema} />
                        <Tables data={turmas} columns={columns} isSubjects={true} />
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