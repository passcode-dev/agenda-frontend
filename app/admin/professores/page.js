"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import ProfessoresService from "@/lib/service/professoresService";
import { Pencil, Trash2, UserRound, IdCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Tables from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";
import styled from "styled-components";
import ProfessorForm from "@/components/forms/professorForm";
import FormatDate from "@/app/utils/FormatDate";
import EditProfessorForm from "@/components/forms/EditprofessorForm";

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

export default function Professores() {
  const [loading, setLoading] = useState(false);
  const [professores, setProfessores] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [editProfessor, setEditProfessor] = useState(null);
  const [novoProfessor, setNovoProfessor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const searchParams = useSearchParams();
  const [error, setError]=useState(false);
  const { toast } = useToast();

  const filterSchema = [
    { name: "Nome", parameterName: "name", icon: <UserRound /> },
    { name: "CPF", parameterName: "cpf", icon: <IdCard /> },
  ];

  const filterSchema2 = [
    { name: "Nome", parameterName: "name", icon: <UserRound /> },
  ];

  const columns = [
    { headerName: "#", field: "id" },
    { headerName: "Nome", field: "name" },
    { headerName: "CPF", field: "cpf" },
    {
      headerName: "Data de Nascimento",
      field: "BirthDate",
      renderCell: (params) => {
        const date = new Date(params.row.BirthDate);
        return FormatDate(date);
      },
    },
    {
      headerName: "Ações",
      field: "acoes",
      renderCell: (params) => (
        <div className="flex justify-center gap-3">
          <Button size="sm" onClick={(e) => editarProfessor(params.row, e)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={(e) => deletarProfessor(params.row.id, e)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const fetchProfessores = async (params) => {
    setLoading(true);
    const professorService = new ProfessoresService();
    const professores = await professorService.Professores(params);
    setHasNextPage(false);
    if (professores?.data?.teachers?.length > 10) {
      setHasNextPage(true);
      professores.data.teachers.pop();
    }
    setProfessores(professores?.data?.teachers);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfessores(searchParams.toString());
  }, [searchParams]);

  const cadastrarProfessor = async (professor) => {
    const professorService = new ProfessoresService();
    const resultado = await professorService.cadastrarProfessor(professor);

    if (resultado.status === "success") {
      setNovoProfessor(null); 
      fetchProfessores(searchParams.toString());
      toast({
        title: "Sucesso",
        description: "Professor cadastrado com sucesso",
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


  const verificaInputs = async (professor) => {
    if (!professor.name || !professor.cpf || !professor.birth_date) {
      setError(true);
    } else {
      setError(false);
      cadastrarProfessor(professor);
    }
  };
  


  const deletarProfessor = async (id, e) => {
    setShowDialog(true);
    e.stopPropagation();
    setConfirmCallback(() => async () => {
      const professorService = new ProfessoresService();
      const deletar = await professorService.deletarProfessor(id);
      if (deletar.status == "success") {
        fetchProfessores(searchParams.toString());
        setShowDialog(false);
        return toast({
          title: "Sucesso",
          description: deletar?.message,
          variant: "success",
        });
      } else {
        return toast({
          title: "Erro",
          description: deletar?.data?.details,
          variant: "destructive",
        });
      }
    });
  };

  const fetchEditarProfessor = async (professor) => {
    const professorService = new ProfessoresService();
    const editar = await professorService.editarProfessor(
      professor.id,
      editProfessor
    );
    if (editar.status != "error") {
      setEditProfessor(null);
      fetchProfessores(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Professor editado com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao editar professor",
        description: editar?.data?.details,
        variant: "destructive",
      });
    }
  };

  const editarProfessor = (professor, e) => {
    setEditProfessor(professor);
    e.stopPropagation(); // Evita que o clique propague para a célula da tabela
  };

  return (
    <>
      {!!novoProfessor && (
        <>
          <Backdrop onClick={() => setNovoProfessor(null)} />
          <GenericModalContent>
            <ProfessorForm
              professor={novoProfessor}
              setProfessorData={setNovoProfessor}
              error={error}
            />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => verificaInputs(novoProfessor)}>
                Salvar
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setNovoProfessor(null)}>Cancelar</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}

      {!!editProfessor && (
        <>
          <Backdrop onClick={() => setEditProfessor(false)} />
          <GenericModalContent>
            <EditProfessorForm
              professor={editProfessor}
              setProfessorData={setEditProfessor}
            />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => fetchEditarProfessor(editProfessor)}>
                Salvar
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setEditProfessor(null)}>Cancelar</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}
      <div className="container max-w-4xl justify-center items-center mx-auto p-6">
        <AlertDialogUI
          title="Confirmação de exclusão"
          description="Deseja realmente deletar este professor?"
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onConfirm={confirmCallback}
        />
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="mt-4 text-3xl font-bold">Professores</h1>
            <p className="text-muted-foreground">
              Lista de professores cadastrados
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <FilterModal filterSchema={filterSchema} />
            <Button className="px-4" onClick={() => setNovoProfessor({})}>
              Novo Professor
            </Button>
          </div>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner message="Carregando..." />
            </div>
          ) : professores.length >= 0 ? (
            <>
              <FilterGroup filterSchema={filterSchema} />
              <Tables data={professores} columns={columns} />
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
