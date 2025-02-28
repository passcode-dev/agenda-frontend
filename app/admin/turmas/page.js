"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import { Pencil, Trash2, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Table from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";
import TurmaService from "@/lib/service/turmaService";
import styled from "styled-components";
import TurmaForm from "@/components/forms/turmaForm";

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

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitlteItem = styled.div`
  font-size: 32px;
  
`

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color:#f4f4f4;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;

  span {
    font-size: 14px;
    color: #6c757d;
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

export default function Turmas() {
  const [loading, setLoading] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [editTurma, setEditTurma] = useState(null);
  const [novaTurma, setNovaTurma] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const searchParams = useSearchParams();
  const [selectedLine, setSelectedLine] = useState();
  const [error, setError] = useState(false);
  const { toast } = useToast();

  const filterSchema = [
    { name: "Nome", parameterName: "name", icon: <UserRound /> },
  ];

  const columns = [
    { headerName: "#", field: "id" },
    { headerName: "Turma", field: "name" },
    {
      headerName: "Ações",
      field: "acoes",
      renderCell: (params) => (
        <div className="flex justify-center gap-3">
          <Button size="sm" onClick={(e) => editarTurma(params.row, e)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={(e) => deletarTurma(params.row.id, e)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const columnsStudents = [

    { headerName: "#", field: "id" },
    { headerName: "Nome", field: "name" },
    { headerName: "Sobrenome", field: "last_name" },
    { headerName: "Telefone", field: "phone_number" },
  ]

  const fetchTurmas = async (params) => {
    setLoading(true);
    const turmaService = new TurmaService();
    const turmas = await turmaService.Turmas(params);
    setHasNextPage(false);
    if (turmas?.data?.classes?.length > 10) {
      setHasNextPage(true);
      turmas.data.classes.pop();
    }
    setTurmas(turmas?.data?.classes);

    setLoading(false);
  };

  useEffect(() => {
    fetchTurmas(searchParams.toString());
  }, [searchParams]);

  const editarTurma = (turma, e) => {
    setEditTurma(turma);
    e.stopPropagation();
  };

  const fetchEditarTurma = async (turma) => {
    const turmaService = new TurmaService();
    const editar = await turmaService.editarTurma(turma.id, turma);
    if (editar.status != "error") {
      setEditTurma(null);
      fetchTurmas(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Turma editada com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao editar turma",
        description: editar?.data?.details,
        variant: "destructive",
      });
    }
  };
  const deletarTurma = async (id, e) => {
    const turmaService = new TurmaService();
    const deletar = await turmaService.deletarTurma(id);
    if (deletar.status != "error") {
      fetchTurmas(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Turma deletada com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao deletar turma",
        description: deletar?.data?.details,
        variant: "destructive",
      });
    }
  };

  const cadastrarTurma = async (turma) => {
    const turmaService = new TurmaService();
    const cadastrar = await turmaService.cadastrarTurma(turma);
    if (cadastrar.status != "error") {
      setNovaTurma(null);
      fetchTurmas(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Turma cadastrada com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao cadastrar turma",
        description: cadastrar?.data?.details,
        variant: "destructive",
      });
    }
  };

  const verificaInputs = async (turma) => {
    if (!turma.name) {
      setError(true);
    } else {
      setError(false);
      cadastrarTurma(turma);
    }
  };
  

  return (
    <>
      {!!selectedLine && (
        <>
          <Backdrop onClick={() => setSelectedLine(false)} />
          <GenericModalContent>
            <div className="flex justify-center">
              <h2 className="text-[26px] font-semibold">Detalhes da Turma</h2>
            </div>
            <DetailsWrapper>
              <DetailItem>
                <TitlteItem>{selectedLine.name}</TitlteItem>
              </DetailItem>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner message="Carregando..." />
                </div>
              ) : turmas?.length >= 0 ? (
                <>
                  <Table
                    data={selectedLine.Students}
                    columns={columnsStudents}
                  />
                </>
              ) : null}

            </DetailsWrapper>
          </GenericModalContent>
        </>
      )}
      
      {!!editTurma && (
        <>
          <Backdrop onClick={() => setEditTurma(false)} />
          <GenericModalContent>
            <TurmaForm turma={editTurma} setTurma={setEditTurma} error={error}/>
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => fetchEditarTurma(editTurma)}>
                Salvar{" "}
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setEditTurma(null)}>Cancelar{console.log("clicou?")}</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}
      {!!novaTurma && (
        <>
          <Backdrop onClick={() => setNovaTurma(false)} />
          <GenericModalContent>
            <TurmaForm turma={novaTurma} setTurma={setNovaTurma} error={error} />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => verificaInputs(novaTurma)}>
                Salvar{" "}
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setNovaTurma(null)}>Cancelar</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}

      <div className="container max-w-4xl justify-center items-center mx-auto p-6">
        <AlertDialogUI
          title="Confirmação de exclusão"
          description="Deseja realmente deletar esta turma?"
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onConfirm={confirmCallback}
        />
        <div className="container max-w-4xl mx-auto p-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="mt-4 text-3xl font-bold">Turmas</h1>
              <p className="text-muted-foreground">
                Lista de turmas cadastrados
              </p>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <FilterModal filterSchema={filterSchema} />
              <Button onClick={() => setNovaTurma({})} className="px-4">Nova Turma</Button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner message="Carregando..." />
            </div>
          ) : turmas?.length >= 0 ? (
            <>
              <FilterGroup filterSchema={filterSchema} />
              <Table
                data={turmas}
                columns={columns}
                isSubjects={true}
                setSelectedLine={setSelectedLine}
              />
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
