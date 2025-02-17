"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import ProfessoresService from "@/lib/service/professoresService";
import { LibraryBig, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Tables from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";
import ClasseService from "@/lib/service/classeService";

export default function Classes() {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [totalPage, setTotalPage] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const currentPage = Number(searchParams.get("page")) || 1
    const filterSchema = [
        { name: "Nome", parameterName: "name", icon: <LibraryBig className="text-black" /> },

    ];

    const columns = [
        { headerName: "#", field: "id" },
        { headerName: "Nome", field: "name" },
        {
            headerName: "Ações",
            field: "acoes",
            renderCell: (params) => (
                <div className="flex justify-center gap-3">
                    <Button size="sm" onClick={() => editarClasse(params.row.id)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => deletarClasse(params.row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const fetchClasses = async (page) => {
        setLoading(true);
        const classeService = new ClasseService ();
        const classes = await classeService.classes(page);
        setTotalPage(Math.ceil(classes.data.total_records / 10));
        setClasses(classes.data.classrooms);
        setLoading(false);
    };

    useEffect(() => {
        fetchClasses(currentPage);
    }, [currentPage]);

    const editarClasse = (id) => {
        router.push(`/admin/classes/editar/${id}`);
    };

    const deletarClasse = async (id) => {
        setShowDialog(true);
        setConfirmCallback(() => async () => {
            const classeService = new ClasseService();
            const deletar = await classeService.deletarClasse(id);
            if (deletar.status == "success") {
                setShowDialog(false);
                fetchClasses(currentPage);
                return toast({
                    title: "Sucesso",
                    description: deletar.message,
                });
            }
            setShowDialog(false);
            fetchClasses(currentPage);
            return toast({
                title: "Erro",
                description: deletar.data.details,
            });
        });
    };

    const handlePageChange = (page) => {
        fetchClasses(page);
    };

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <AlertDialogUI
                title="Confirmação de exclusão"
                description="Deseja realmente deletar essa classe?"
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onConfirm={confirmCallback}
            />
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">Classes</h1>
                    <p className="text-muted-foreground">Lista de classes cadastrados</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                    <FilterModal filterSchema={filterSchema} />
                    <Link className="flex items-center justify-center" href="/admin/classes/novo">
                        <Button className="px-4">Nova Classe</Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner message="Carregando..." />
                    </div>
                ) : classes.length >= 0 ? (
                    <>
                        <FilterGroup filterSchema={filterSchema} />
                        <Tables data={classes} columns={columns} />
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