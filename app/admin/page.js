"use client";

import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import Table from "@/components/tables/Tables";
import { ProLayout, PageContainer, ProCard } from "@ant-design/pro-components";
import { Layout, Row, Col, Statistic } from "antd";
import { UserRound } from "lucide-react";
import { use, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import styled from "styled-components";
import AlunoService from "@/lib/service/alunoService";
import { useSearchParams } from "next/navigation";
import ProfessoresService from "@/lib/service/professoresService";
import TurmaService from "@/lib/service/turmaService";
import DashService from "@/lib/service/dashService";

const COLORS = [
  "#4CAF50",
  "#FF5252",
  "#FFC107",
  "#2196F3",
  "#9C27B0",
  "#FF9800",
  "#00BCD4",
];

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
  const [totalAlunos, setTotalAlunos] = useState("");
  const [aulasC, setAulasC] = useState(0);
  const [aulasP, setAulasP] = useState(0);
  const [makeupClasses, setMakeupClasses] = useState([]);
  const [classesByCourse, setClassesByCourse] = useState([]);
  const searchParams = useSearchParams();
  const [sortedData, setSortedData] = useState([]);
  // Estados para o filtro de datas
  const [filterMode, setFilterMode] = useState("geral"); // "geral" ou "data"
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchDashboardData = async () => {
    try {
      // Professores e aulas pendentes/concluídas
      const professorService = new ProfessoresService();
      const prof = await professorService.GetAulasPendentes();
      setTeacher(prof.data);

      


      console.log("Dados de professores:", prof.data);
      const dashService = new DashService();
      // Se o usuário escolheu o filtro "Por Período" e as datas foram preenchidas, monta a query
      const query =
        filterMode === "data" && startDate && endDate
          ? `?start_date=${startDate}&end_date=${endDate}`
          : "";
      const aulas = await dashService.GetAulas(query);
      setAulasC(aulas.total_classes_completed);
      setAulasP(aulas.total_classes_pending);

      // Total de alunos
      const alunoService = new AlunoService();
      const alunos = await alunoService.totalStudents();
      setTotalAlunos(alunos.data.total_students);

      // Aulas de Reposição vs. Aulas Normais
      const makeupData = await dashService.GetMakeupClasses(query);
      console.log("Dados de Makeup Classes:", makeupData);
      setMakeupClasses([
        { name: "Aulas de Reposição", value: Number(makeupData.makeup_classes) },
        { name: "Aulas Normais", value: Number(makeupData.normal_classes) },
      ]);

      // Aulas por Curso
      const courseData = await dashService.GetClassesByCourse(query);
      setClassesByCourse(
        (courseData ?? []).map((c) => ({ name: c.course_name, value: c.total_classes }))
      );
      
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    setSortedData([...(teacher || [])]
      .map(t => ({
        ...t,
        completed_classes: Number(t.completed_classes),
        }))
        .sort((a, b) => a.completed_classes - b.completed_classes));
  },[teacher]);

  return (
    <PageContainer>
      {/* Filtro de Data */}
     {/* <div className="flex items-center gap-4 p-4 border-b mb-4">
         Filtro de Data 
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filtro:</label>
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="border rounded p-1"
          >
            <option value="geral">Geral</option>
            <option value="data">Por Período</option>
          </select>
        </div>
        {filterMode === "data" && (
          <>
            <div className="flex flex-col">
              <label className="text-sm">Data Início:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm">Data Fim:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-1"
              />
            </div>
            <button
              onClick={fetchDashboardData}
              className="bg-blue-600 text-white rounded px-3 py-1"
            >
              Aplicar
            </button>
          </>
        )}
      </div>*/}
      

      <div className="flex flex-col gap-6 p-4">
        <Row gutter={[16, 24]}>
          <Col span={8}>
            <StyledProCard>
              <Statistic
                title="Aulas Pendentes"
                value={aulasP}
                valueStyle={{ color: "#FF5252" }}
              />
            </StyledProCard>
          </Col>
          <Col span={8}>
            <StyledProCard>
              <Statistic
                title="Aulas Concluídas"
                value={aulasC}
                valueStyle={{ color: "#4CAF50" }}
              />
            </StyledProCard>
          </Col>
          <Col span={8}>
            <StyledProCard>
              <Statistic
                title="Total de alunos"
                value={totalAlunos}
                valueStyle={{ color: "#FFC107" }}
              />
            </StyledProCard>
          </Col>
        </Row>

        {/* Gráfico de Barras */}
        <StyledProCard title="Aulas Mensais Realizadas">
          <ResponsiveContainer width="100%" height={300} >
            <BarChart
              data={sortedData}
            >
              
              <XAxis dataKey="teacher_name" stroke="#4CAF50" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed_classes" fill="#4CAF50" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </StyledProCard>

        {/* Gráficos de Pizza lado a lado */}
        <div className="flex flex-row gap-6">
          <StyledProCard title="Distribuição de Aulas de Reposição" className="flex-1">
            {makeupClasses && makeupClasses.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={makeupClasses}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {makeupClasses.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16">Sem dados para exibir</div>
            )}
          </StyledProCard>

          <StyledProCard title="Distribuição de Aulas por Curso" className="flex-1">
            {classesByCourse && classesByCourse.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={classesByCourse}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {classesByCourse.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16">Sem dados para exibir</div>
            )}
          </StyledProCard>
        </div>
      </div>
    </PageContainer>
  );
}
