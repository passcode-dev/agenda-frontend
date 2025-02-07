"use client";
import Link from "next/link";
import { Calendar, IdCard, Pencil, Phone, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import AlunoService from "@/lib/service/alunoService";
import Table from "@/components/tables/Tables";
import { PaginationUI } from "@/components/paginationCustom";
import FilterGroup from "@/components/Filters/FilterGroup";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertDialogUI } from "@/components/alert";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import FilterModal from "@/components/Filters/FilterModal";



export default function Alunos() {
    const [loading, setLoading] = useState(false);
    const [alunos, setAlunos] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const currentPage = Number(searchParams.get("page")) || 1

    const filterSchema = [
        { name: "Nome", parameterName: "name", icon: <UserRound /> },
        { name: "RG", parameterName: "rg", icon: <IdCard /> },
        { name: "CPF", parameterName: "cpf", icon: <IdCard /> },
        { name: "Telefone", parameterName: "phone_number", icon: <Phone /> },
        {
            parameterName: 'Data de Nascimento',
            name: 'birth_date',
            type: 'text',  // Tipo de filtro
            renderCell: (value, setValue) => {
                // Aqui, 'value' seria o valor do filtro atual, passado a partir de seu estado.
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DemoContainer components={["DateField"]}>
                            <DateField
                                value={value ? dayjs(value, "DD-MM-YYYY") : null} // Use o valor passado para 'renderCell'
                                onChange={(e) => {
                                    const formattedDate = e ? e.format("DD-MM-YYYY") : ""; // Formata a data
                                    setValue(formattedDate); // Atualiza o valor do filtro
                                }}
                                className="w-full"
                                label="Digite a data"
                                format="DD/MM/YYYY" // Formato da exibição da data
                            />
                        </DemoContainer>
                    </LocalizationProvider>
                );
            }
        },
    ];

    const columns = [
        { headerName: "#", field: "id" },
        { headerName: "Nome", field: "name" },
        { headerName: "Telefone", field: "phone_number" },
        { headerName: "RG", field: "rg" },
        { headerName: "CPF", field: "cpf" },
        { headerName: "Data de Nascimento", field: "birth_date", },
        { headerName: "Data de Entrada", field: "entry_date", },
        { headerName: "Data de Saída", field: "exit_date", },
        {
            headerName: "Ações",
            field: "acoes",
            renderCell: (params) => (
                <div className="flex justify-center gap-3 ">
                    <Button size="sm" onClick={() => editarAluno(params.row.id)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={() => deletarAluno(params.row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const fetchAlunos = async (page) => {
        setLoading(true);
        const alunoService = new AlunoService();
        const alunos = await alunoService.alunos(page);
        setAlunos(alunos.data.students);
        setTotalPage(Math.ceil(alunos.data.total_records / 10));
        setLoading(false);
    };

    useEffect(() => {
        fetchAlunos(currentPage);
    }, [currentPage]);

    const editarAluno = (id) => {
        router.push(`/admin/alunos/editar/${id}`);
    };

    const deletarAluno = async (id) => {
        setShowDialog(true);
        setConfirmCallback(() => async () => {
            const alunoService = new AlunoService();
            const deletar = await alunoService.deletarAluno(id);
            if (deletar.status == "success") {
                setShowDialog(false);
                fetchAlunos(currentPage);
                return toast({
                    title: "Sucesso",
                    description: deletar.message,
                });

            }

            setShowDialog(false);
            fetchAlunos(currentPage);
            return toast({
                title: "Erro",
                description: deletar.data.details,
                variant: "destructive",
            });
        });
    };

    const handlePageChange = (page) => {
        fetchAlunos(page);
    };

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
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
                    <Link className="flex items-center justify-center" href="/admin/alunos/novo">
                        <Button className="px-4">Novo Aluno</Button>
                    </Link>
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
                        <Table data={alunos} columns={columns} />
                        <div className="mt-4 flex justify-end items-center">
                            <PaginationUI
                                totalPage={totalPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                ) : null
                }
            </div>
        </div >
    );
}
