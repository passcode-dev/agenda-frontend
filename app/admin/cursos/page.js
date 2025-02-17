"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import { Pencil, Trash2, LibraryBig } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Tables from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";
import CursoService from "@/lib/service/cursoService";
import { Badge } from "@/components/ui/badge";

export default function Cursos() {
    const [loading, setLoading] = useState(false);
    const [turmas, setTurmas] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [totalPage, setTotalPage] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const currentPage = searchParams.get("page") || 1;

    useEffect(() => {
        fetchCursos(searchParams.toString());
    }, [searchParams]);

    const filterSchema = [
        { name: "Nome", parameterName: "name", icon: <LibraryBig className="text-black" /> },
    ];

    const columns = [
        { headerName: "#", field: "id" },
        { headerName: "Curso", field: "name" },
        {
            headerName: "Turma", field: "nameTurma", renderCell: (params) => (
                <div className="flex flex-wrap  gap-1 justify-center">
                    {params.row.Classes.map((turma, index) => (
                        <Badge className="p-2" key={index}>
                            {turma.name}
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
                    <Button size="sm" onClick={() => deletarCurso(params.row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const fetchCursos = async (params) => { 
        setLoading(true);
        const cursoService = new CursoService();
        const cursos = await cursoService.Cursos(params);
        setTurmas(cursos.data.courses);
        setTotalPage(Math.ceil(cursos.data.total_records / 10));
        setLoading(false);
    };

    const editarMateria = (id) => {
        router.push(`/admin/cursos/editar/${id}`);
    };

    const deletarCurso = async (id) => {
        setShowDialog(true);
        setConfirmCallback(() => async () => {
            const cursoService = new CursoService();
            const deletar = await cursoService.deletarCurso(id);
            if (deletar.status == "success") {
                fetchCursos(searchParams.toString());
                setShowDialog(false);
                return toast({
                    title: "Sucesso",
                    description: deletar.message,
                });
            }
            fetchCursos(searchParams.toString());
            setShowDialog(false);
            return toast({
                title: "Erro",
                description: deletar.data.details,
            });
        });
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <AlertDialogUI
                title="Confirmação de exclusão"
                description="Deseja realmente deletar esse curso ?"
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onConfirm={confirmCallback}
            />
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">Cursos</h1>
                    <p className="text-muted-foreground">Lista de cursos cadastrados</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                    <FilterModal filterSchema={filterSchema} />
                    <Link className="flex items-center justify-center" href="/admin/cursos/novo">
                        <Button className="px-4">Novo Curso</Button>
                    </Link>
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
                        <Tables data={turmas} columns={columns} isSubjects={true} clickable={false} />
                        <div className="mt-4 flex justify-end items-center">
                            <PaginationUI totalPage={totalPage} onPageChange={handlePageChange} />
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}
