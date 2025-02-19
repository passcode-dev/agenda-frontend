"use client";
import Link from "next/link";
import {
  Calendar,
  IdCard,
  Pencil,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import AlunoService from "@/lib/service/alunoService";
import Table from "@/components/tables/Tables";
import { PaginationUI } from "@/components/paginationCustom";
import FilterGroup from "@/components/Filters/FilterGroup";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { AlertDialogUI } from "@/components/alert";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterModal from "@/components/Filters/FilterModal";
import styled from "styled-components";
import AlunoForm from "@/components/forms/alunoForm";
import FormatDate from "@/app/utils/FormatDate";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

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

const ContainerLogs = styled.div`
  width: 100%;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: scroll;
`;

const LogContainer = styled.div`
  padding: 10px;
  margin-top: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 5px solid #007bff;
`;

const InfoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: all 0.3s ease-in-out;
  span {
    font-size: 14px;
    font-weight: 600;
    color: #777;
    text-transform: uppercase;
    margin-bottom: 4px;
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

export default function Alunos() {
  const aulasMarcadas = [
    {
      data: "2025-02-15",
      hora: "10:00",
      mensagem:
        "Oi, gostaria de agendar uma aula para o dia 15 de fevereiro às 10:00.",
    },
    {
      data: "2025-02-16",
      hora: "14:30",
      mensagem:
        "Olá! Poderia marcar uma aula no dia 16 de fevereiro às 14:30? Aguardo confirmação.",
    },
    {
      data: "2025-02-17",
      hora: "08:00",
      mensagem:
        "Oi! Preciso de uma aula no dia 17 de fevereiro, às 08:00. Obrigado!",
    },
    {
      data: "2025-02-18",
      hora: "19:00",
      mensagem:
        "Oi, gostaria de agendar para o dia 18 de fevereiro às 19:00. Tem disponibilidade?",
    },
    {
      data: "2025-02-15",
      hora: "10:00",
      mensagem:
        "Oi, gostaria de agendar uma aula para o dia 15 de fevereiro às 10:00.",
    },
    {
      data: "2025-02-15",
      hora: "10:00",
      mensagem:
        "Oi, gostaria de agendar uma aula para o dia 15 de fevereiro às 10:00.",
    },
  ];

  const date = dayjs.utc("2022-04-30T00:00:00Z");
  console.log(date.format("DD/MM/YYYY HH:mm:ss")); // 30/04/2022 00:00:00

  
  const [selectedLine, setSelectedLine] = useState();
  const [loading, setLoading] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [editAluno, setEditAluno] = useState(null);
  const [novoAluno, setNovoAluno] = useState(null); 
  const [hasNextPage, setHasNextPage] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const filterSchema = [
    { name: "Nome", parameterName: "name", icon: <UserRound /> },
    { name: "RG", parameterName: "rg", icon: <IdCard /> },
    { name: "CPF", parameterName: "cpf", icon: <IdCard /> },
    { name: "Telefone", parameterName: "phone_number", icon: <Phone /> },
  ];

  const columns = [
    { headerName: "#", field: "id" },
    { headerName: "Nome", field: "name" },
    { headerName: "Sobrenome", field: "last_name" },
    { headerName: "Telefone", field: "phone_number" },
    { headerName: "RG", field: "rg" },
    { headerName: "CPF", field: "cpf" },
    {
      headerName: "Data de Nascimento",
      field: "birth_date",
      renderCell: (params) => {
        const date = params.row.birth_date;

        return FormatDate(date);
      },
    },
    {
      headerName: "Data de Entrada",
      field: "entry_date",
      renderCell: (params) => {
        const date = params.row.entry_date;
        return FormatDate(date);
      },
    },
    {
      headerName: "Data de Saída",
      field: "exit_date",
      renderCell: (params) => {
        const date = params.row.exit_date;
        return date ? FormatDate(date):"Sem previsão";
      },
    },
    {
      headerName: "Ações",
      field: "acoes",
      renderCell: (params) => (
        <div className="flex justify-center gap-3">
          <Button size="sm" onClick={(e) => editarAluno(params.row, e)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={(e) => deletarAluno(params.row.id, e)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const fetchAlunos = async (params) => {
    setLoading(true);
    const alunoService = new AlunoService();
    const alunos = await alunoService.alunos(params);
    setHasNextPage(false);

    if (alunos?.data?.students?.length > 10) {
      setHasNextPage(true);
      alunos.data.students.pop();
    }
    
    setAlunos(alunos?.data?.students);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlunos(searchParams.toString());
  }, [searchParams]);

  const cadastrarAluno = async (aluno) => {
    const alunoService = new AlunoService();
    const resultado = await alunoService.cadastrarAluno(aluno);

    if (resultado.status === "success") {
      setNovoAluno(null); // Fechar o modal
      fetchAlunos(searchParams.toString()); // Recarregar a lista de alunos
      toast({
        title: "Sucesso",
        description: "Aluno cadastrado com sucesso",
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

  const deletarAluno = async (id, e) => {
    setShowDialog(true);
    e.stopPropagation();
    setConfirmCallback(() => async () => {
      const alunoService = new AlunoService();
      const deletar = await alunoService.deletarAluno(id);
      if (deletar.status == "success") {
        fetchAlunos(searchParams.toString());
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

  const editarAluno = (aluno, e) => {
    setEditAluno(aluno);
    e.stopPropagation(); 
  };

  const fetchEditarAluno = async (aluno) => {
    const alunoService = new AlunoService();
    const editar = await alunoService.editarAluno(aluno.id, aluno);
    if (editar.status != "error") {
      setEditAluno(null);
      fetchAlunos(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Aluno editado com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao editar aluno",
        description: editar?.data?.details,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {!!selectedLine && (
        <>
          <Backdrop onClick={() => setSelectedLine(false)} />
          <GenericModalContent>
            <h2>Detalhes do Aluno</h2>
            <InfoContainer>
              <InfoItem>
                <span>Nome</span>
                {selectedLine.name}
              </InfoItem>
              <InfoItem>
                <span>Telefone</span>
                {selectedLine.phone_number}
              </InfoItem>
              <InfoItem>
                <span>RG</span>
                {selectedLine.rg}
              </InfoItem>
              <InfoItem>
                <span>CPF</span>
                {selectedLine.cpf}
              </InfoItem>
              <InfoItem>
                <span>Data de nascimento</span>
                { FormatDate(selectedLine.birth_date)}
              </InfoItem>
              <InfoItem>
                <span>Data de entrada</span>
                {FormatDate(selectedLine.entry_date)}
              </InfoItem>
              <InfoItem>
                <span>Data de saída</span>
                {selectedLine.exit_date ? FormatDate(selectedLine.exit_date) : "Sem previsão de saída"}
              </InfoItem>
            </InfoContainer>
            {/* 
                        <ContainerLogs>
                            <h3>📜 Logs de Atividade</h3>
                            {whatsappLog.length > 0 ? (
                                whatsappLog.map((aula, index) => (
                                    <LogContainer key={index}>
                                        <p><strong>Data:</strong> {aula.data}</p>
                                        <p><strong>Hora:</strong> {aula.hora}</p>
                                        <p><strong>Mensagem:</strong> {aula.mensagem}</p>
                                    </LogContainer>
                                ))
                            ) : (
                                <p>Nenhum log encontrado.</p>
                            )}
                        </ContainerLogs> */}
          </GenericModalContent>
        </>
      )}

      {!!editAluno && (
        <>
          <Backdrop onClick={() => setEditAluno(false)} />
          <GenericModalContent>
            <AlunoForm aluno={editAluno} setAlunoData={setEditAluno} />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => fetchEditarAluno(editAluno)}>
                Salvar
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setEditAluno(null)}>
                Cancelar
              </StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}

      {!!novoAluno && (
        <>
          <Backdrop onClick={() => setNovoAluno(null)} />
          <GenericModalContent>
            <AlunoForm aluno={novoAluno} setAlunoData={setNovoAluno} />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => cadastrarAluno(novoAluno)}>Salvar</StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setNovoAluno(null)}>Cancelar</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}

      <div className="container justify-center items-center mx-auto p-6">
        <AlertDialogUI
          title="Confirmação de exclusão"
          description="Deseja realmente deletar este aluno?"
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onConfirm={confirmCallback}
        />
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="mt-4 text-3xl font-bold">Alunos</h1>
            <p className="text-muted-foreground">Lista de alunos cadastrados</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <FilterModal filterSchema={filterSchema} />
            <Button className="px-4" onClick={() => setNovoAluno({})}>
              Novo Aluno
            </Button>
          </div>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner message="Carregando..." />
            </div>
          ) : alunos?.length >= 0 ? (
            <>
              <FilterGroup filterSchema={filterSchema} />

              <Table
                data={alunos}
                columns={columns}
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
