"use client";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef, useState } from "react";
import UsuarioService from "@/lib/service/usuarioService";
import { Input } from "@/components/ui/input";
import { SelectUI } from "@/components/selectCustom";
import { useToast } from "@/hooks/use-toast";
import { PaginationUI } from "@/components/paginationCustom";
import Tables from "@/components/tables/Tables";

export default function Usuarios() {
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([
        {
            id: 1,
            usuario: "usuario1",
            email: "usuario1@example.com",
        },
        {
            id: 2,
            usuario: "usuario2",
            email: "usuario2@example.com",
        },
        {
            id: 3,
            usuario: "usuario3",
            email: "usuario3@example.com",
        },
        {
            id: 4,
            usuario: "usuario4",
            email: "usuario4@example.com",
        },
        {
            id: 5,
            usuario: "usuario5",
            email: "usuario5@example.com",
        },
        {
            id: 6,
            usuario: "usuario6",
            email: "usuario6@example.com",
        },
        {
            id: 7,
            usuario: "usuario7",
            email: "usuario7@example.com",
        },
        {
            id: 8,
            usuario: "usuario8",
            email: "usuario8@example.com",
        },
        {
            id: 9,
            usuario: "usuario9",
            email: "usuario9@example.com",
        },
        {
            id: 10,
            usuario: "usuario10",
            email: "usuario10@example.com",
        },
    ]);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const filtro = useRef("");
    const { toast } = useToast();

    const columns = [
        { field: "usuario", headerName: "Usuário" },
        { field: "email", headerName: "Email" },
        {
            headerName: "Ações", field: "acoes", renderCell: (row) => (
                <div className="flex justify-center gap-3">
                    <Button size="sm" onClick={() => editarUsuario(row.id)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => deletarUsuario(row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            // const usuarioService = new UsuarioService();
            // const usuarios = await usuarioService.usuarios();
            // setUsuarios(usuarios);
        } catch (error) {
            toast({
                title: "Erro ao carregar usuários",
                description: "Não foi possível carregar a lista de usuários.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const editarUsuario = (id) => {
        router.push(`/admin/alunos/editar/${id}`);
    };

    const deletarUsuario = (id) => {
        const confirm = window.confirm("Deseja realmente deletar este aluno?");
        if (confirm) {
            // Implementar lógica de exclusão aqui
            toast({
                title: "Usuário excluído",
                description: `O usuário com ID ${id} foi excluído.`,
            });
        }
    };

    const valorSelect = (value) => {
        setSelectedFilter(value);
    };

    const filtroUsuarios = async () => {
        const searchValue = filtro.current.value.trim();
        if (!searchValue && !selectedFilter) {
            fetchUsuarios();
            return;
        }

        if (!searchValue && selectedFilter) {
            return toast({
                title: "Digite um valor",
                description: "Digite um valor para pesquisar.",
            });
        }

        if (searchValue && !selectedFilter) {
            return toast({
                title: "Selecione um filtro",
                description: "Selecione um filtro para pesquisar.",
            });
        }

        // Adicione lógica para aplicar o filtro aqui
        toast({
            title: "Pesquisa em andamento",
            description: `Pesquisando por ${selectedFilter}: ${searchValue}`,
        });
    };

    const paginationData = usuarios.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(usuarios.length / itemsPerPage);

    return (
        <div className="container max-w-4xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">Usuários</h1>
                    <p className="text-muted-foreground">Lista de usuários cadastrados</p>
                </div>
                <div>
                    <Link href="/admin/usuarios/novo">
                        <Button className="px-4 py-2 rounded mt-4">Novo Usuário</Button>
                    </Link>
                </div>
            </div>
            <div className="mt-4">

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 items-end mb-6">
                    <div>
                        <Input
                            type="text"
                            placeholder="Pesquisar..."
                            ref={filtro}
                        />
                    </div>
                    <div>
                        <SelectUI
                            placeholder="Filtrar por..."
                            items={["Usuário", "Email"]}
                            onValueChange={valorSelect}
                        />
                    </div>
                    <div className="flex justify-start sm:justify-end">
                        <Button onClick={filtroUsuarios}>Pesquisar</Button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner message="Carregando..." />
                    </div>
                ) : (
                    usuarios.length > 0 ? (
                        <>
                            <Tables
                                columns={columns}
                                data={paginationData}
                                onEdit={editarUsuario}
                                onDelete={deletarUsuario}
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
                            <p>Nenhum usuário cadastrado.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
