"use client";

import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import AutoCompleteComponent from "@/components/Filters/InputCustom/AutoCompleteComponent";
import Table from "@/components/tables/Tables";
import { ProLayout, PageContainer, ProCard } from "@ant-design/pro-components";
import { Layout, Row, Col, Statistic } from "antd";
import { UserRound } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import styled from "styled-components";

const dataBar = [
    { name: "Pedro", vendas: 20 },
    { name: "Leonardo", vendas: 25 },
    { name: "Gabriel", vendas: 22 },
    { name: "Leonardo2", vendas: 15 },
    { name: "Rodrigo", vendas: 10 },
    { name: "Luan", vendas: 9 },
    { name: "Clarinha", vendas: 18 },
    { name: "Vitoria", vendas: 16 },
    { name: "Luana", vendas: 26 },
    { name: "Marcos", vendas: 38 },
    { name: "Rogéria", vendas: 1 },
];

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
    { headerName: "#", field: "id" },
    { headerName: "Nome", field: "name" },
    { headerName: "CPF", field: "cpf" },
    {
        headerName: "Data de Nascimento",
        field: "BirthDate",
        renderCell: (params) => {
            const date = new Date(params.row.BirthDate);
            return date.toLocaleDateString("pt-BR");
        },

    },

];

const dataTable = [
    { key: "1", name: "Professor Carlos", subject: "Matemática", classesGiven: 120, rating: "4.8" },
    { key: "2", name: "Professora Ana", subject: "Português", classesGiven: 95, rating: "4.6" },
    { key: "3", name: "Professor João", subject: "Física", classesGiven: 110, rating: "4.7" },
];

export default function Admin() {
    const [teacher, setTeacher] = useState(dataTable);
    const [filterValue, setFilterValue] = useState("");

    const filterSchema = [
        {
            name: "Nome", parameterName: "name", icon: <UserRound />, renderCell: (filterValue, setFilterValue) => {
                return (
                    <AutoCompleteComponent
                        value={filterValue}
                        setValue={setFilterValue}
                    />
                );
            }
        },
    ];

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
                            <Statistic title="Faturamento" value={12500} prefix="R$" valueStyle={{ color: '#FFC107' }} />
                        </StyledProCard>
                    </Col>
                </Row>

                {/* Gráfico de Barras */}
                <StyledProCard title="Aulas Mensais Realizadas">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataBar.sort((a, b) => a.vendas - b.vendas)}>
                            <XAxis dataKey="name" stroke="#4CAF50" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="vendas" fill="#4CAF50" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </StyledProCard>



                <StyledProCard title="Distribuição de Aulas">
                    <div className="flex justify-end">
                        <FilterModal filterSchema={filterSchema} />
                    </div>
                    <div className="w-full flex flex-row">
                        <div className="flex w-full max-w-md border justify-center">
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
                        <div className="w-full max-w-md">
                            <Table columns={columns} data={teacher} />
                        </div>
                    </div>
                </StyledProCard>
            </div>
        </PageContainer >
    );
}