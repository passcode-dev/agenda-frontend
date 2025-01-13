"use client";
import { Mail, Pencil, Trash2, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef, useState } from "react";
import UsuarioService from "@/lib/service/usuarioService";
import { useToast } from "@/hooks/use-toast";
import { PaginationUI } from "@/components/paginationCustom";
import Tables from "@/components/tables/Tables";
import FilterModal from "@/components/Filters/FilterModal";
import FilterGroup from "@/components/Filters/FilterGroup";
import { useRouter, useSearchParams } from "next/navigation";

export default function Usuarios() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get("page")) || 1;
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
    const [totalPage, setTotalPage] = useState(3);
    const { toast } = useToast();

    const filterSchema = [
        { name: "Usuário", parameterName: "user", icon: <User className="text-black" /> },
        { name: "Email", parameterName: "email", icon: <Mail className="text-black" />, },

    ];

    const columns = [
        { field: "id", headerName: "#" },
        { field: "usuario", headerName: "Usuário" },
        { field: "email", headerName: "Email" },
        {
            headerName: "Ações", field: "acoes", renderCell: (params) => (
                <div className="flex justify-center gap-3">
                    <Button size="sm" onClick={() => editarUsuario(params.row.id)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => deletarUsuario(params.row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const fetchUsuarios = async (page) => {
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
        fetchUsuarios(currentPage);
    }, [currentPage]);

    const editarUsuario = (id) => {
        router.push(`/admin/usuarios/editar/${id}`);
    };

    const deletarUsuario = (id) => {
        const confirm = window.confirm("Deseja realmente deletar este usuário?");
        if (confirm) {
            // Implementar lógica de exclusão aqui
            toast({
                title: "Usuário excluído",
                description: `O usuário com ID ${id} foi excluído.`,
            });
        }
    };

    const handlePageChange = (page) => {
        fetchUsuarios(page);
    };

    return (
        <div className="container max-w-4xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">Usuários</h1>
                    <p className="text-muted-foreground">Lista de usuários cadastrados</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                    <FilterModal filterSchema={filterSchema} />
                    <Link className="flex items-center justify-center" href="/admin/usuarios/novo">
                        <Button className="px-4">Novo Usuário</Button>
                    </Link>
                </div>
            </div>
            <FilterGroup filterSchema={filterSchema} />
            <div className="mt-4">

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner message="Carregando..." />
                    </div>
                ) : (
                    usuarios.length > 0 ? (
                        <>
                            <Tables
                                columns={columns}
                                data={usuarios}
                            />
                            <div className="mt-4 flex justify-end items-center">
                                <PaginationUI
                                    totalPage={totalPage}
                                    onPageChange={handlePageChange}
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
