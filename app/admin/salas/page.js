"use client";
import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import { PaginationUI } from "@/components/paginationCustom";
import { Spinner } from "@/components/ui/spinner";
import { LibraryBig, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import Tables from "@/components/tables/Tables";
import { AlertDialogUI } from "@/components/alert";
import SalaService from "@/lib/service/salaService";
import styled from "styled-components";
import SalaForm from "@/components/forms/salaForm";

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
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 1000px;
  height: fit-content;
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

export default function Salas() {
  const [loading, setLoading] = useState(false);
  const [salas, setSalas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [editSala, setEditSala] = useState(null);
  const [novaSala, setNovaSala] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [error,setError]=useState(false);
  const { toast } = useToast();

    const filterSchema = [
        { name: "Nome", parameterName: "name", icon: <LibraryBig className="text-black" /> },

    ];

  const columns = [
    { headerName: "#", field: "id" },
    { headerName: "Nome", field: "name" },
    {
      headerName: "Ações",
      field: "acoes",
      renderCell: (params) => (
        <div className="flex justify-center gap-3">
          <Button size="sm" onClick={(e) => editarSala(params.row, e)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={(e) => deletarSala(params.row.id, e)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const deletarSala = async (id, e) => {
    setShowDialog(true);
    e.stopPropagation();
    setConfirmCallback(() => async () => {
      const salaService = new SalaService();
      const deletar = await salaService.deletarSala(id);
      if (deletar.status == "success") {
        fetchSalas(searchParams.toString());
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

  const editarSala = (sala, e) => {
    console.log(sala);
    setEditSala(sala);
    e.stopPropagation(); // Evita que o clique propague para a célula da tabela
  };

  const cadastrarSala = async (sala) => {
    const salaService = new SalaService();
    const resultado = await salaService.cadastrarSala(sala);

    if (resultado.status === "success") {
      setNovaSala(null); // Fechar o modal
      fetchSalas(searchParams.toString()); // Recarregar a lista de alunos
      toast({
        title: "Sucesso",
        description: "Sala cadastrada com sucesso",
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

  const fetchSalas = async (params) => {
    setLoading(true);
    const salaService = new SalaService();
    const salas = await salaService.Salas(params);
    setHasNextPage(false);
    
    if (salas?.data?.classrooms?.length > 10) {
      setHasNextPage(true);
      salas.data.classrooms.pop();
    }
    setSalas(salas?.data?.classrooms);
    console.log("salas aqui ",salas.data.classrooms);
    setLoading(false);
  };


  const verificaInputs = async (sala) => {
    if (!sala.name) {
      setError(true);
    } else {
      setError(false);
      cadastrarSala(sala);
    }
  };
  
  useEffect(() => {
    fetchSalas(searchParams.toString());
  }, [searchParams]);

  const fetchEditarSalas = async (sala) => {
    const editSala = { name: sala.name };
    const salaService = new SalaService();
    const editar = await salaService.editarSala(sala.id, editSala);
    console.log(editar);
    if (editar.status != "error") {
      setEditSala(null);
      fetchSalas(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Sala editada com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao editar sala",
        description: editar?.data?.details,
        variant: "destructive",
      });
    }
  };

  

  return (
    <>
      {!!editSala && (
        <>
          <Backdrop onClick={() => setEditSala(false)} />
          <GenericModalContent>
            <SalaForm sala={editSala} setSalaData={setEditSala} />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => fetchEditarSalas(editSala)}>
                Salvar{" "}
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setEditSala(null)}>Cancelar</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}

      {!!novaSala && (
        <>
          <Backdrop onClick={() => setNovaSala(null)} />
          <GenericModalContent> 
            <SalaForm sala={novaSala} setSalaData={setNovaSala} error={error}/>
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => verificaInputs(novaSala)}>
                Salvar
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setNovaSala(null)}>Cancelar</StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}
      <div className="container max-w-4xl justify-center items-center mx-auto p-6">
        <AlertDialogUI
          title="Confirmação de exclusão"
          description="Deseja realmente deletar essa sala?"
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onConfirm={confirmCallback}
        />
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="mt-4 text-3xl font-bold">Salas</h1>
            <p className="text-muted-foreground">
              Lista de salas cadastradas
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <FilterModal filterSchema={filterSchema} />
            <Button className="px-4" onClick={() => setNovaSala({})}>
              Nova Sala
            </Button>
          </div>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner message="Carregando..." />
            </div>
          ) : salas.length >= 0 ? (
            <>
              <FilterGroup filterSchema={filterSchema} />
              <Tables data={salas} columns={columns} />
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
