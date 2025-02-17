"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import { Pencil, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Tables from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";
import { Badge } from "@/components/ui/badge";
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

export default function Turmas() {
  const [loading, setLoading] = useState(false);
  const [turmas, setTurmas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [editTurma, setEditTurma] = useState(null);
  const [novaTurma, setNovaTurma] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const filterSchema = [
    { name: "Nome", parameterName: "name", icon: <UserRound /> },
  ];

  const columns = [
    { headerName: "#", field: "id" },
    { headerName: "Turma", field: "name" },
    {
      headerName: "Alunos",
      field: "name",
      renderCell: (params) => (
        <div className="flex flex-wrap  gap-1 justify-center">
          {params.row.Students.map((aluno, index) => (
            <Badge className="p-2" key={index}>
              {aluno.name}
            </Badge>
          ))}
        </div>
      ),
    },
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
    e.stopPropagation(); // Evita que o clique propague para a célula da tabela
  };

  const fetchEditarProfessor = async (turma) => {
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

  return (
    <>
      {!!editTurma && (
        <>
          <Backdrop onClick={() => setEditTurma(false)} />
          <GenericModalContent>
            <TurmaForm turma={editTurma} setTurma={setEditTurma} />
            <div>
              <button onClick={() => fetchEditarProfessor(editTurma)}>
                Salvar{" "}
              </button>
              <button onClick={() => setTurma(null)}>Cancelar</button>
            </div>
          </GenericModalContent>
        </>
      )}
      {!!novaTurma && (
        <>
          <Backdrop onClick={() => setNovaTurma(false)} />
          <GenericModalContent>
            <TurmaForm turma={novaTurma} setTurma={setNovaTurma} />
            <div>
              <button onClick={() => cadastrarTurma(novaTurma)}>
                Salvar{" "}
              </button>
              <button onClick={() => setNovaTurma(null)}>Cancelar</button>
            </div>
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
          ) : turmas.length >= 0 ? (
            <>
              <FilterGroup filterSchema={filterSchema} />
              <Tables data={turmas} columns={columns} isSubjects={true} />
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
