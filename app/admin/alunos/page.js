"use client";
import Link from "next/link";
import { ArrowLeft, ArrowLeftCircle, Filter, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import AlunoService from "@/lib/service/alunoService";
import { useRouter } from "next/navigation";
import Back from "@/components/back";
import Table from "@/components/tables/Tables";
import { PaginationUI } from "@/components/paginationCustom";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";

export default function Alunos() {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [alunos, setAlunos] = useState([]);
    const router = useRouter();


    const filterSchema = [
        {
            name: 'Data de Nascimento',
            Value: <input />
        },
        {
            name: 'Telefone',

        },
        {
            name: 'CEP',
        }
    ];



    const columns = [
        { headerName: "Nome", field: "name" },
        { headerName: "Telefone", field: "phone_number" },
        { headerName: "RG", field: "rg" },
        { headerName: "CPF", field: "cpf" },
        { headerName: "Data de Nascimento", field: "birth_date", renderCell: ({ row }) => new Date(row.birth_date).toLocaleDateString("pt-BR") },
        {
            headerName: "Ações", field: "acoes", renderCell: (row) => (
                <div className="flex justify-center gap-3">
                    <Button size="sm" onClick={() => editarAluno(row.id)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => deletarAluno(row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];


    const fetchAlunos = async () => {
        setLoading(true);
        const alunoService = await new AlunoService();
        const alunos = await alunoService.alunos();
        if (alunos.length > 0) {
            setLoading(false);
            setAlunos(alunos);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlunos();
    }, []);

    const editarAluno = (id) => {
        router.push(`/admin/alunos/editar/${id}`);
    };

    const deletarAluno = (id) => {
        const confirm = window.confirm("Deseja realmente deletar este aluno?");
        if (!confirm) return;

        console.log("Deletar aluno", id);
    };

    const paginationData = alunos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(alunos.length / itemsPerPage);

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Alunos
                    </h1>
                    <p className="text-muted-foreground">
                        Lista de alunos cadastrados
                    </p>
                </div>
                <div>
                    <Link href="/admin/alunos/novo">
                        <Button className="px-4 py-2 rounded mt-4">
                            Novo Aluno
                        </Button>
                    </Link>
                    <FilterModal
                        filterSchema={filterSchema}
                    />
                </div>
            </div>
            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner message="Carregando..." />
                    </div>
                ) : (
                    alunos.length > 0 ? (
                        <>
                            <FilterGroup
                                filterSchema={filterSchema}
                            />
                            <Table
                                data={paginationData}
                                columns={columns}
                            />
                            <div className="mt-4 flex justify-end items-center">
                                <PaginationUI
                                    currentPage={currentPage}
                                    onPageChange={setCurrentPage}
                                    totalPages={totalPages}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <p>Nenhum aluno cadastrado.</p>
                        </div>
                    )
                )}
            </div>
        </div >
    );
}
