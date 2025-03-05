"use client";
import { Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PaginationUI } from "@/components/paginationCustom";
import Tables from "@/components/tables/Tables";
import FilterModal from "@/components/Filters/FilterModal";
import FilterGroup from "@/components/Filters/FilterGroup";
import { useSearchParams } from "next/navigation";
import { AlertDialogUI } from "@/components/alert";
import styled from "styled-components";
import CursoService from "@/lib/service/cursoService";
import CourseForm from "@/components/forms/courseForm";

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

export default function Courses() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [editCourse, setEditCourse] = useState(null);
  const [newCourse, setNewCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [confirmCallback, setConfirmCallback] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState(false);
  const { toast } = useToast();
  const filterSchema = [
    {
      name: "Nome",
      parameterName: "name",
      icon: <User className="text-black" />,
    },
  ];

  const columns = [
    { field: "id", headerName: "#" },
    { field: "name", headerName: "Nome" },
    {
      headerName: "Ações",
      field: "acoes",
      renderCell: (params) => (
        <div className="flex justify-center gap-3">
          <Button size="sm" onClick={(e) => funcEditCourses(params.row, e)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={(e) => removeCourse(params.row.id, e)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const fetchCourses = async (params) => {
    try {
      const cursoService = new CursoService();
      const cursos = await cursoService.cursos(params);
      setCourses(cursos?.data.courses ? cursos?.data.courses : []);

      setHasNextPage(false);
      if (cursos?.data?.courses?.length > 10) {
        setHasNextPage(true);
        cursos.data.courses.pop();
      }

      setLoading(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: cursos.data.details,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const removeCourse = async (id, e) => {
    setShowDialog(true);
    e.stopPropagation();
    setConfirmCallback(() => async () => {
      const cursoService = new CursoService();
      const deletar = await cursoService.removeCourse(id);
      if (deletar.status == "success") {
        fetchCourses(searchParams.toString());
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
  }

  useEffect(() => {
    fetchCourses(searchParams.toString());
  }, [searchParams]);

  const funcEditCourses = (course, e) => {
    setEditCourse(course);
    e.stopPropagation();
  };

  const fetchEditCourse = async (course) => {
    const cursoService = new CursoService();
    const editar = await cursoService.editCourse(course.id, course);
    if (editar.status != "error") {
      setEditCourse(null);
      fetchCourses(searchParams.toString());
      return toast({
        title: "Sucesso",
        description: "Curso editado com sucesso",
        variant: "success",
      });
    } else {
      return toast({
        title: "Erro ao editar curso",
        description: editar?.data?.details,
        variant: "destructive",
      });
    }
  };

  const createCourse = async (curso) => {
    const cursoService = new CursoService();
    const resultado = await cursoService.createCurso(curso);

    if (resultado.status === "success") {
      setNewCourse(null); // Fechar o modal
      fetchCourses(searchParams.toString()); // Recarregar a lista de alunos
      toast({
        title: "Sucesso",
        description: "Curso cadastrado com sucesso",
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

  const verificaInputs = async (curso) => {
    if (!curso.name) {
      setError(true);
    } else {
      setError(false);
      createCourse(curso);
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
          <h1 className="mt-4 text-3xl font-bold">Cursos</h1>
          <p className="text-muted-foreground">Lista de Cursos cadastrados</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-2">
          <FilterModal filterSchema={filterSchema} />

          <Button className="px-4" onClick={() => setNewCourse({})}>
            Novo Curso
          </Button>
        </div>
      </div>
      <FilterGroup filterSchema={filterSchema} />
      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner message="Carregando..." />
          </div>
        ) : courses.length >= 0 ? (
          <>
            <Tables columns={columns} data={courses} />
            <div className="mt-4 flex justify-end items-center">
              <PaginationUI hasNextPage={hasNextPage} />
            </div>
          </>
        ) : null}
      </div>

      {!!editCourse && (
        <>
          <Backdrop onClick={() => setEditCourse(false)} />
          <GenericModalContent>
            <CourseForm course={editCourse} setCourseData={setEditCourse} />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => fetchEditCourse(editCourse)}>
                Salvar{" "}
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setEditCourse(null)}>
                Cancelar
              </StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}

      {!!newCourse && (
        <>
          <Backdrop onClick={() => setNewCourse(null)} />
          <GenericModalContent>
            <CourseForm course={newCourse} setCourseData={setNewCourse} error={error} />
            <ButtonGroup>
              <StyledButtonPrimary onClick={() => verificaInputs(newCourse)}>
                Salvar
              </StyledButtonPrimary>
              <StyledButtonSecondary onClick={() => setNewCourse(null)}>
                Cancelar
              </StyledButtonSecondary>
            </ButtonGroup>
          </GenericModalContent>
        </>
      )}
    </div>
  );
}
