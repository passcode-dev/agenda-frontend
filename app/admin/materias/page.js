"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Pencil, Trash2, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertDialogUI } from "@/components/alert";
import MateriaService from "@/lib/service/materiaService";
import { Badge } from "@/components/ui/badge";
import styled from "styled-components";
import MateriaForm from "@/components/forms/materiaForm";
import Tables from "@/components/tables/Tables";

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

export default function Materias() {
  const [loading, setLoading] = useState(false);
  const [materias, setMaterias] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [editMateria, setEditMateria] = useState(null);
  const [novaMateria, setNovaMateria] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const currentPage = Number(searchParams.get("page")) || 1;
  const filterSchema = [
    { name: "Nome", parameterName: "name", icon: <UserRound /> },
  ];

  const columns = [
    { headerName: "#", field: "id" },
    { headerName: "Nome", field: "name" },
    {
      headerName: "Ações",
      field: "acoes",
      renderCell: (params) => (
        <div className="flex justify-center gap-3">
          <Button size="sm" onClick={(e) => editarMateria(params.row, e)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={(e) => deletarMateria(params.row.id, e)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const fetchMateria = async (params) => {
    setLoading(true);
    const materiaService = new MateriaService();
    const materias = await materiaService.Materias(params);
    setHasNextPage(false);
    if (materias?.data?.subjects?.length > 10) {
      setHasNextPage(true);
      materias.data.subjects.pop();
    }
    setMaterias(materias?.data?.subjects);
    setLoading(false);
  };

  useEffect(() => {
    fetchMateria(searchParams.toString());
  }, [searchParams]);

  const editarMateria = (materia, e) => {
    setEditMateria(materia);
    e.stopPropagation(); // Evita que o clique propague para a célula da tabela
  };

  const fetchEditarMateria = async (materia) => {
    const materiaService = new MateriaService();
    const editar = await materiaService.editarMateria(materia.id, materia);
    if (editar.status != "error") {
      setEditMateria(null);
      fetchMateria(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Matéria editada com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao editar matéria",
        description: editar?.data?.details,
        variant: "destructive",
      });
    }
  };

  const deletarMateria = async (id, e) => {
    setShowDialog(true);
    e.stopPropagation();
    setConfirmCallback(() => async () => {
      const materiaService = new MateriaService();
      const deletar = await materiaService.deletarMateria(id);
      if (deletar.status == "success") {
        fetchMateria(searchParams.toString());
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

  const fetchNovaMateria = async (materia) => {
    const materiaService = new MateriaService();
    const cadastrar = await materiaService.cadastrarMateria(materia);
    if (cadastrar.status != "error") {
      setNovaMateria(null);
      fetchMateria(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Matéria cadastrada com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao cadastrar matéria",
        description: cadastrar?.data?.details,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {!!novaMateria && (
        <>
          <Backdrop onClick={() => setNovaMateria(false)} />
          <GenericModalContent>
            <MateriaForm
              materia={novaMateria}
              setMateriaData={setNovaMateria}
            />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => fetchNovaMateria(novaMateria)}>
                Salvar{" "}
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setNovaMateria(null)}>Cancelar</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}

      {!!editMateria && (
        <>
          <Backdrop onClick={() => setEditMateria(false)} />
          <GenericModalContent>
            <MateriaForm
              materia={editMateria}
              setMateriaData={setEditMateria}
            />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => fetchEditarMateria(editMateria)}>
                Salvar{" "}
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setEditMateria(null)}>Cancelar</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}

      <div className="container max-w-4xl justify-center items-center mx-auto p-6">
        <AlertDialogUI
          title="Confirmação de exclusão"
          description="Deseja realmente deletar essa Matéria?"
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onConfirm={confirmCallback}
        />
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="mt-4 text-3xl font-bold">Matérias</h1>
            <p className="text-muted-foreground">
              Lista de Matérias cadastrados
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <FilterModal filterSchema={filterSchema} />
            <Button className="px-4" onClick={() => setNovaMateria({})}>
              Nova Matéria
            </Button>
          </div>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner message="Carregando..." />
            </div>
          ) : materias.length >= 0 ? (
            <>
              <FilterGroup filterSchema={filterSchema} />
              <Tables data={materias} columns={columns} />
              <div className="mt-4 flex justify-end items-center">
                <PaginationUI hasNextPage={hasNextPage} />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
