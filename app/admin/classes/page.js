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
import ClasseService from "@/lib/service/classeService";
import styled from "styled-components";
import ClasseForm from "@/components/forms/classeForm";

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

export default function Classes() {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(null);
  const [editClasse, setEditClasse] = useState(null);
  const [novaClasse, setNovaClasse] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { toast } = useToast();

    const currentPage = Number(searchParams.get("page")) || 1
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
          <Button size="sm" onClick={(e) => editarClasse(params.row, e)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={(e) => deletarClasse(params.row.id, e)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const deletarClasse = async (id, e) => {
    setShowDialog(true);
    e.stopPropagation();
    setConfirmCallback(() => async () => {
      const classeService = new ClasseService();
      const deletar = await classeService.deletarClasse(id);
      if (deletar.status == "success") {
        fetchClasses(searchParams.toString());
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

  const editarClasse = (classe, e) => {
    console.log(classe);
    setEditClasse(classe);
    e.stopPropagation(); // Evita que o clique propague para a célula da tabela
  };

  const cadastrarClasse = async (classe) => {
    const classeService = new ClasseService();
    const resultado = await classeService.cadastrarClasse(classe);

    if (resultado.status === "success") {
      setNovaClasse(null); // Fechar o modal
      fetchClasses(searchParams.toString()); // Recarregar a lista de alunos
      toast({
        title: "Sucesso",
        description: "Classe cadastrado com sucesso",
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

  const fetchClasses = async (params) => {
    setLoading(true);
    const classeService = new ClasseService();
    const classes = await classeService.classes(params);
    console.log(classes);
    setHasNextPage(false);
    if (classes?.data?.classrooms?.length > 10) {
      setHasNextPage(true);
      classes.data.classrooms.pop();
    }
    setClasses(classes.data.classrooms);
    setLoading(false);
  };

  const fetchEditarClasses = async (classe) => {
    const editClasse = { name: classe.name };
    const classeService = new ClasseService();
    const editar = await classeService.editarClasse(classe.id, editClasse);
    console.log(editar);
    if (editar.status != "error") {
      setEditClasse(null);
      fetchClasses(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Classe editada com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao editar classe",
        description: editar?.data?.details,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchClasses(searchParams.toString());
  }, [currentPage]);

  return (
    <>
      {!!editClasse && (
        <>
          <Backdrop onClick={() => setEditClasse(false)} />
          <GenericModalContent>
            <ClasseForm classe={editClasse} setClasseData={setEditClasse} />
            <div>
              <button onClick={() => fetchEditarClasses(editClasse)}>
                Salvar{" "}
              </button>
              <button onClick={() => setEditClasse(null)}>Cancelar</button>
            </div>
          </GenericModalContent>
        </>
      )}

      {!!novaClasse && (
        <>
          <Backdrop onClick={() => setNovaClasse(null)} />
          <GenericModalContent>
            <ClasseForm classe={novaClasse} setClasseData={setNovaClasse} />
            <div>
              <button onClick={() => cadastrarClasse(novaClasse)}>
                Salvar
              </button>
              <button onClick={() => setNovaClasse(null)}>Cancelar</button>
            </div>
          </GenericModalContent>
        </>
      )}
      <div className="container max-w-4xl justify-center items-center mx-auto p-6">
        <AlertDialogUI
          title="Confirmação de exclusão"
          description="Deseja realmente deletar essa classe?"
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          onConfirm={confirmCallback}
        />
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="mt-4 text-3xl font-bold">Classes</h1>
            <p className="text-muted-foreground">
              Lista de classes cadastrados
            </p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <FilterModal filterSchema={filterSchema} />
            <Button className="px-4" onClick={() => setNovaClasse({})}>
              Nova Classe
            </Button>
          </div>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner message="Carregando..." />
            </div>
          ) : classes.length >= 0 ? (
            <>
              <FilterGroup filterSchema={filterSchema} />
              <Tables data={classes} columns={columns} />
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
