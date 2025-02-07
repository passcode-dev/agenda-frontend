"use client";

import FilterGroup from "@/components/Filters/FilterGroup";
import FilterModal from "@/components/Filters/FilterModal";
import AutoCompleteComponent from "@/components/Filters/InputCustom/AutoCompleteComponent";
import { ProLayout, PageContainer, ProCard } from "@ant-design/pro-components";
import { DateField, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Layout, Row, Col, Statistic, AutoComplete } from "antd";
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

const COLORS = ["#0088FE", "#DA3E52"];

const StyledProCard = styled(ProCard)`
    background-color: #fafafa; /* Cor de fundo */
    border-radius: 12px; /* Bordas arredondadas */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra suave */
    padding: 16px; /* Espaçamento interno */
`;



export default function Admin() {
    const [options, setOptions] = useState([]);

    const filterSchema = [
        {
            name: "Nome", parameterName: "name", icon: <UserRound />, renderCell: (value, setValue) => {
                return (
                    <AutoCompleteComponent
                        value={value} // Passa o valor atual do filtro para o AutoComplete
                        setValue={setValue} // Passa a função de atualização para o AutoComplete
                    />
                );
            }
        },];




    return (
        <PageContainer>
            <Row gutter={[16, 24]}> {/* Ajuste de espaçamento entre colunas */}
                <Col span={8}>
                    <StyledProCard>
                        <Statistic title="Aulas Pendentes" value={1200} />
                    </StyledProCard>
                </Col>
                <Col span={8}>
                    <StyledProCard>
                        <Statistic title="Aulas Concluídas" value={350} />
                    </StyledProCard>
                </Col>
                <Col span={8}>
                    <StyledProCard>
                        <Statistic title="Faturamento" value={12500} prefix="R$" />
                    </StyledProCard>
                </Col>
            </Row>

            {/* Gráfico de Barras */}
            <ProCard title="Aulas Mensais Realizadas" style={{ marginTop: 50, backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataBar.sort((a, b) => a.vendas - b.vendas)}>
                        <XAxis dataKey="name" stroke="#8884d8" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="vendas" fill="#8884d8" barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </ProCard>



            {/* Gráfico de Pizza */}
            <ProCard title="Distribuição de Produtos" style={{ marginTop: 20, backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
                <div className="w-full flex flex-col justify-end">
                    <FilterModal filterSchema={filterSchema} />
                </div>
                <div className="flex flex-row">
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name }) => name}>
                                    {dataPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                </div>

            </ProCard>

        </PageContainer>
    );
}
