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
    const [alunos, setAlunos] = useState([
        {
            id: 1,
            nome: "João Silva",
            email: "joao.silva@example.com",
            telefone: "123456789",
            dataNascimento: "2000-01-01",
        },
        {
            id: 2,
            nome: "Maria Oliveira",
            email: "maria.oliveira@example.com",
            telefone: "987654321",
            dataNascimento: "1995-05-15",
        },
        {
            id: 3,
            nome: "José Santos",
            email: "jose.santos@example.com",
            telefone: "456123789",
            dataNascimento: "1988-03-20",
        },
        {
            id: 4,
            nome: "Ana Pereira",
            email: "ana.pereira@example.com",
            telefone: "789456123",
            dataNascimento: "1992-07-10",
        },
        {
            id: 5,
            nome: "Carlos Lima",
            email: "carlos.lima@example.com",
            telefone: "321654987",
            dataNascimento: "1985-11-05",
        },
        {
            id: 6,
            nome: "Fernanda Costa",
            email: "fernanda.costa@example.com",
            telefone: "654987321",
            dataNascimento: "1998-09-25",
        },
        {
            id: 7,
            nome: "Pedro Rocha",
            email: "pedro.rocha@example.com",
            telefone: "987321654",
            dataNascimento: "1980-04-30",
        },
        {
            id: 8,
            nome: "Mariana Almeida",
            email: "mariana.almeida@example.com",
            telefone: "321987654",
            dataNascimento: "1993-12-12",
        },
        {
            id: 9,
            nome: "Rafael Gomes",
            email: "rafael.gomes@example.com",
            telefone: "654321987",
            dataNascimento: "1987-06-18",
        },
        {
            id: 10,
            nome: "Sofia Martins",
            email: "sofia.martins@example.com",
            telefone: "987654321",
            dataNascimento: "1991-08-08",
        },
        {
            id: 11,
            nome: "Lucas Oliveira",
            email: "lucas.oliveira@example.com",
            telefone: "123456789",
            dataNascimento: "1990-02-14",
        },
        {
            id: 12,
            nome: "Camila Pereira",
            email: "camila.pereira@example.com",
            telefone: "987654321",
            dataNascimento: "1989-10-03",
        },
        {
            id: 13,
            nome: "Ricardo Santos",
            email: "ricardo.santos@example.com",
            telefone: "456123789",
            dataNascimento: "1984-06-22",
        },
        {
            id: 14,
            nome: "Juliana Lima",
            email: "juliana.lima@example.com",
            telefone: "789456123",
            dataNascimento: "1994-04-17",
        },
        {
            id: 15,
            nome: "Gustavo Costa",
            email: "gustavo.costa@example.com",
            telefone: "321654987",
            dataNascimento: "1983-09-08",
        }
    ]);
    const router = useRouter();



    const columns = [
        { headerName: "Nome", field: "nome" },
        { headerName: "Email", field: "email" },
        { headerName: "Telefone", field: "telefone" },
        { headerName: "Data de Nascimento", field: "dataNascimento" },
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
