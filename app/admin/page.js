"use client";

import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import AutoCompleteComponent from "@/components/Filters/InputCustom/AutoCompleteComponent";
import Table from "@/components/tables/Tables";
import { ProLayout, PageContainer, ProCard } from "@ant-design/pro-components";
import { Layout, Row, Col, Statistic } from "antd";
import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styled from "styled-components";
import AlunoService from "@/lib/service/alunoService";
import { useSearchParams } from "next/navigation";
import ProfessoresService from "@/lib/service/professoresService";
import TurmaService from "@/lib/service/turmaService";

const dataPie = [
    { name: "Aulas realizadas", value: 40 },
    { name: "Aulas pendentes", value: 60 },
];

const COLORS = ["#4CAF50", "#FF5252"];

const StyledProCard = styled(ProCard)`
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;

`;

const columns = [
    { headerName: "#", field: "teacher_id" },
    { headerName: "Nome", field: "teacher_name" },
    { headerName: "Aulas dadas", field: "completed_classes" },
];


export default function Admin() {
    const [teacher, setTeacher] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const searchParams = useSearchParams();
    const [turmas, setTurmas] = useState([]);
    const [totalAlunos, setTotalAlunos] = useState("");
    const [loading, setLoading] = useState(false);

    const filterSchema = [
    { name: "Nome", parameterName: "name", icon: <UserRound /> },
  ];


    const fetchAulasProf = async () => {
        try {
            const professorService = new ProfessoresService();
            const prof = await professorService.GetAulasPendentes();
            console.log("professores: ", prof.data);
            setTeacher(prof.data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUsuarios = async () => {

        const alunoService = new AlunoService();
        const alunos = await alunoService.totalStudents();
        console.log(alunos);
        setTotalAlunos(alunos.data.total_students);
    };

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
        fetchUsuarios();
        
        fetchAulasProf();
    }, [searchParams]);

    return (
        <PageContainer>


            <div className="flex flex-col gap-6 p-4">

                <Row gutter={[16, 24]}>
                    <Col span={8}>
                        <StyledProCard>
                            <Statistic title="Aulas Pendentes" value={1200} valueStyle={{ color: '#FF5252' }} />
                        </StyledProCard>
                    </Col>
                    <Col span={8}>
                        <StyledProCard>
                            <Statistic title="Aulas Concluídas" value={350} valueStyle={{ color: '#4CAF50' }} />
                        </StyledProCard>
                    </Col>
                    <Col span={8}>
                        <StyledProCard>
                            <Statistic title="Total de alunos" value={totalAlunos} prefix="" valueStyle={{ color: '#FFC107' }} />
                        </StyledProCard>
                    </Col>
                </Row>

                {/* Gráfico de Barras */}
                <StyledProCard title="Aulas Mensais Realizadas">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={teacher.sort((a, b) => a.completed_classes - b.completed_classes)}>
                            <XAxis dataKey="teacher_name" stroke="#4CAF50" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="completed_classes" fill="#4CAF50" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </StyledProCard>



                <StyledProCard title="Distribuição de Aulas">
                    <div className="flex justify-end">
                        <FilterModal filterSchema={filterSchema} />
                    </div>
                    <div className="w-full flex flex-row">
                        <div className="flex w-full max-w-md justify-center">
                            <ResponsiveContainer width="50%" height={300}>
                                <PieChart>
                                    <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {dataPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full">

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Spinner message="Carregando..." />
                                </div>
                            ) : teacher?.length >= 0 ? (
                                <>
                                    <FilterGroup filterSchema={filterSchema} />
                                    <Table
                                        data={teacher}
                                        columns={columns}
                                    />
                                </>
                            ) : null}
                        </div>
                    </div>
                </StyledProCard>
            </div>
        </PageContainer >
    );
}