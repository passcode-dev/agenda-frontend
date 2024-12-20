import React from "react";
import Table from "./Table";
import { format } from "date-fns";

const mockData = [
  { idEvento: 1, nome: "Evento A", data: "2024-12-20", descricao: "Descrição A", quantidadeParticipantes: 100, status: false },
  { idEvento: 2, nome: "Evento B", data: "2024-12-21", descricao: "Descrição B", quantidadeParticipantes: 150, status: true },
  // Adicione mais itens aqui
];

const Mock = () => {
  const handleEdit = (row) => alert(`Editar: ${JSON.stringify(row)}`);
  const handleStatusChange = (row) => alert(`Alterar Status: ${JSON.stringify(row)}`);
  const setCurrentEvento = (row) => console.log(`Evento Atual: ${JSON.stringify(row)}`);
  const setOpenDeleteDialog = (open) => console.log(`Dialog de exclusão: ${open}`);

  const columns = [
    { field: "idEvento", headerName: "ID", flex: 0.5 },
    { field: "nome", headerName: "Nome", flex: 1 },
    {
      field: "data",
      headerName: "Data",
      flex: 1,
      valueGetter: (date) => format(new Date(date), "dd/MM/yyyy"),
    },
    { field: "descricao", headerName: "Descrição", flex: 2 },
    { field: "quantidadeParticipantes", headerName: "Participantes", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      valueGetter: (status) => (status ? "Finalizado" : "Em andamento"),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mock Table Test</h1>
      <Table list={mockData} columns={columns} pageSize={5} />
    </div>
  );
};

export default Mock;
