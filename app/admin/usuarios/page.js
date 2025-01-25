"use client";
import { Mail, Pencil, Trash2, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useContext, useEffect, useRef, useState } from "react";
import UsuarioService from "@/lib/service/usuarioService";
import { useToast } from "@/hooks/use-toast";
import { PaginationUI } from "@/components/paginationCustom";
import Tables from "@/components/tables/Tables";
import FilterModal from "@/components/Filters/FilterModal";
import FilterGroup from "@/components/Filters/FilterGroup";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertDialogUI } from "@/components/alert";
import { UserContext } from "@/app/context/userContext";


export default function Usuarios() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const currentPage = Number(searchParams.get("page")) || 1;
    const [usuarios, setUsuarios] = useState([]);
    const [totalPage, setTotalPage] = useState(3);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(false);
    const { user } = useContext(UserContext);
    const { toast } = useToast();
    const filterSchema = [
        { name: "Usuário", parameterName: "user", icon: <User className="text-black" /> },
        { name: "Email", parameterName: "email", icon: <Mail className="text-black" />, },

    ];

    const columns = [
        { field: "id", headerName: "#" },
        { field: "username", headerName: "Usuário" },
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
            const usuarioService = new UsuarioService();
            const usuarios = await usuarioService.usuarios();
            setUsuarios(usuarios.data);
        } catch (error) {
            toast({
                title: "Erro ao carregar usuários",
                description: usuarios.message,
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
        if (user.id == id) {
            return toast({
                title: "Erro ao editar usuário",
                description: "Você não pode editar o próprio usuário, vai até a página de perfil para alterar seus dados.",
                variant: "destructive",
            });
        }
        router.push(`/admin/usuarios/editar/${id}`);
    };

    const deletarUsuario = (id) => {
        if (user.id == id) {
            return toast({
                title: "Erro ao deletar usuário",
                description: "Você não pode deletar o próprio usuário, vai até a página de perfil para deletar sua conta.",
                variant: "destructive",
            });
        }

        setConfirmCallback(() => async () => {
            const usuarioService = new UsuarioService();
            const deletar = await usuarioService.deletarUsuario(id);
            if (deletar.status == "success") {
                setShowDialog(false);
                fetchUsuarios(currentPage);
                return toast({
                    title: "Usuário deletado com sucesso",
                    description: deletar.message,
                    variant: "success",
                });

            }

            setShowDialog(false);
            fetchUsuarios(currentPage);
            return toast({
                title: "Erro ao deletar usuário",
                description: deletar.message,
                variant: "destructive",
            });
        });
        setShowDialog(true);
    };

    const handlePageChange = (page) => {
        fetchUsuarios(page);
    };

    return (
        <div className="container max-w-4xl mx-auto p-6">
            <AlertDialogUI
                title="Confirmação de exclusão"
                description="Deseja realmente deletar este usuário?"
                showDialog={showDialog}
                setShowDialog={setShowDialog}
                onConfirm={confirmCallback}
            />
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
                    usuarios.length >= 0 ? (
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
