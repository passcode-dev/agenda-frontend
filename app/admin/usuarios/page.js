"use client";
import { Mail, Pencil, Trash2, User, LibraryBig } from "lucide-react";
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
import UserForm from "@/components/forms/userForm";
import styled from "styled-components";



const GenericModalContent = styled.div`
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;

  opacity: 0;
  transform: translateY(-20px);
  animation: slideDown 0.3s ease-out forwards;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;


const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 99;
`;


const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 1rem;
`;

const StyledButtonPrimary = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StyledButtonSecondary = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #e53935;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;


export default function Usuarios() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [editUser, setEditUser] = useState(null);
    const [novoUser, setNovoUser] = useState(null); 
    const currentPage = Number(searchParams.get("page")) || 1;
    const [usuarios, setUsuarios] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(false);
    const { user } = useContext(UserContext);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [error, setError] = useState(false);
    const { toast } = useToast();
    const filterSchema = [
        { name: "Usuário", parameterName: "username", icon: <User className="text-black" /> },
        { name: "Email", parameterName: "email", icon: <Mail className="text-black" />, },

    ];

    const columns = [
        { field: "id", headerName: "#" },
        { field: "username", headerName: "Usuário" },
        { field: "email", headerName: "Email" },
        {
            headerName: "Ações", field: "acoes", renderCell: (params) => (
                <div className="flex justify-center gap-3">
                    <Button size="sm" onClick={(e) => editarUsuario(params.row, e)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={(e) => deletarUsuario(params.row.id, e)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    const fetchUsuarios = async (page) => {
        try {
            const usuarioService = new UsuarioService();
            const usuarios = await usuarioService.usuarios(page);
            setUsuarios(usuarios?.data.users ? usuarios?.data.users : []);

            setHasNextPage(false)
            if (usuarios?.data?.users?.length > 10) {
                setHasNextPage(true);
                usuarios.data.users.pop();
            }

            setLoading(false);
        } catch (error) {
            toast({
                title: "Erro",
                description: usuarios.data.details,
                variant: "destructive",
            });
            setLoading(false);
        }

    };

    const deletarUsuario = async (id, e) => {
        setShowDialog(true);
        e.stopPropagation();
        setConfirmCallback(() => async () => {

            const usuarioService = new UsuarioService();
            const deletar = await usuarioService.deletarUsuario(id);

            if (deletar.status == "success") {
                fetchUsuarios(searchParams.toString());
                setShowDialog(false);

                return toast({
                    title: "Sucesso",
                    description: deletar?.message,
                    variant: "success",
                });
            }

            setShowDialog(false);
            return toast({
                title: "Erro",
                description: deletar?.data?.details,
                variant: "destructive",
            });
        });
    };

    useEffect(() => {
        fetchUsuarios(searchParams.toString());
    }, [searchParams]);


    const editarUsuario = (user, e) => {
        setEditUser(user);
        e.stopPropagation();
    };

    const fetchEditarUser = async (user) => {
        const userService = new UsuarioService();
        const editar = await userService.alterarUsuario(user.id, user);
        console.log(editar);
        if (editar.status != "error") {
            setEditUser(null);
            fetchUsuarios(searchParams.toString());
            return toast({
                title: "Sucesso",
                description: "Usuario editado com sucesso",
                variant: "success",
            });
        } else {
            return toast({
                title: "Erro ao editar usuario",
                description: editar?.data?.details,
                variant: "destructive",
            });
        }
    };

    const cadastrarUsuario = async (user) => {
        const userService = new UsuarioService();
        const resultado = await userService.CadastrarUsuario(user);
    
        if (resultado.status === "success") {
          setNovoUser(null); // Fechar o modal
          fetchUsuarios(searchParams.toString()); // Recarregar a lista de alunos
          toast({
            title: "Sucesso",
            description: "Usuario cadastrado com sucesso",
            variant: "success",
          });
        } else {
          toast({
            title: "Erro",
            description: resultado?.data?.details,
            variant: "destructive",
          });
        }
      };
      const verificaInputs = async (usuario) => {
        if (!usuario.name || !usuario.email || !usuario.password) {
          setError(true);
        } else {
          setError(false);
          cadastrarUsuario(usuario);
        }
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
                    
                        <Button className="px-4" onClick={() => setNovoUser({})}>Novo Usuário</Button>
                  
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
                                    hasNextPage={hasNextPage}
                                />
                            </div>
                        </>
                    ) : null
                )}
            </div>


            {!!editUser && (
                <>
                    <Backdrop onClick={() => setEditUser(false)} />
                    <GenericModalContent>
                        <UserForm user={editUser} setUserData={setEditUser} />
                        <ButtonGroup>
                            <StyledButtonPrimary onClick={() => fetchEditarUser(editUser)}>
                                Salvar{" "}
                            </StyledButtonPrimary>
                            <StyledButtonSecondary onClick={() => setEditUser(null)}>Cancelar</StyledButtonSecondary>
                        </ButtonGroup>
                    </GenericModalContent>
                </>
            )}

            {!!novoUser && (
                <>
                    <Backdrop onClick={() => setNovoUser(null)} />
                    <GenericModalContent>
                        <UserForm user={novoUser} setUserData={setNovoUser} error={error}/>
                        <ButtonGroup>
                            <StyledButtonPrimary onClick={() => verificaInputs(novoUser)}>Salvar</StyledButtonPrimary>
                            <StyledButtonSecondary onClick={() => setNovoUser(null)}>Cancelar</StyledButtonSecondary>
                        </ButtonGroup>
                    </GenericModalContent>
                </>
            )}

        </div>

    );
}
