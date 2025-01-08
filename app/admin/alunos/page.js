"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TableAlunoUI from "@/components/tables/tableAluno";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import AlunoService from "@/lib/service/alunoService";
import { useRouter } from "next/navigation";
import Back from "@/components/back";

export default function Alunos() {
    const [loading, setLoading] = useState(true);
    const [alunos, setAlunos] = useState([]);
    const router = useRouter();
    const columns = ["Nome", "Email", "Telefone", "Data de Nascimento", "Ações"];
    const data = [
        {
            nome: "João",
            email: "w@w.com",
            telefone: "123456789",
            dataNascimento: "01/01/2000",
        },
        {
            nome: "Maria",
            email: "w@w.com",
            telefone: "123456789",
            dataNascimento: "01/01/2000",
        },
        {
            nome: "José",
            email: "w@w.com",
            telefone: "123456789",
            dataNascimento: "01/01/2000",
        },
    ];

    const fetchAlunos = async () => {
        setLoading(true);
        const alunoService = await new AlunoService();
        const alunos = await alunoService.alunos();
        if (alunos.length > 0) {
            setLoading(false);
            return setAlunos(alunos);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchAlunos();
    })

    const editarAluno = (id) => {
        router.push(`/admin/alunos/editar/${id}`);
    }

    const deletarAluno = (id) => {
        const confirm = window.confirm("Deseja realmente deletar este aluno?");
        if (!confirm) {
            return;
        }

        console.log("Deletar aluno", id);
    }

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
                    data.length > 0 ? (
                        <TableAlunoUI columns={columns} data={data} onEdit={editarAluno} onDelete={deletarAluno} />
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