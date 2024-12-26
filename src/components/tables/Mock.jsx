import React, { useEffect, useState } from "react";
import Table from "./Table";
import { format } from "date-fns";
import Actions from "../actions/Actions";

const mockData = [
  {
    id: 1,
    username: "John Doe",
    Email: "john@example.com",
  },
  {
    id: 2,
    username: "Jane Smith",
    Email: "jane@example.com",
  },
  {
    id: 3,
    username: "Bob Johnson",
    Email: "bob@example.com",
  },
  {
    id: 4,
    username: "Alice Brown",
    Email: "alice@example.com",
  },
  {
    id: 5,
    username: "Charlie Davis",
    Email: "charlie@example.com",
  },
  {
    id: 6,
    username: "Eva Wilson",
    Email: "eva@example.com",
  },
  {
    id: 7,
    username: "Frank Miller",
    Email: "frank@example.com",
  },
  {
    id: 8,
    username: "Grace Lee",
    Email: "grace@example.com",
  },
  {
    id: 9,
    username: "Henry Taylor",
    Email: "henry@example.com",
  },
  {
    id: 10,
    username: "Ivy Clark",
    Email: "ivy@example.com",
  },
  {
    id: 6,
    username: "Eva Wilson",
    Email: "eva@example.com",
  },
  {
    id: 7,
    username: "Frank Miller",
    Email: "frank@example.com",
  },
  {
    id: 8,
    username: "Grace Lee",
    Email: "grace@example.com",
  },
  {
    id: 9,
    username: "Henry Taylor",
    Email: "henry@example.com",
  },
  {
    id: 10,
    username: "Ivy Clark",
    Email: "ivy@example.com",
  },
  {
    id: 6,
    username: "Eva Wilson",
    Email: "eva@example.com",
  },
  {
    id: 7,
    username: "Frank Miller",
    Email: "frank@example.com",
  },
  {
    id: 8,
    username: "Grace Lee",
    Email: "grace@example.com",
  },
  {
    id: 9,
    username: "Henry Taylor",
    Email: "henry@example.com",
  },
  {
    id: 10,
    username: "Ivy Clark",
    Email: "ivy@example.com",
  },
];

const Mock = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const handleEdit = () => {
    if (selectedRows.length === 1) {
      alert(`Editar: ${JSON.stringify(selectedRows[0])}`);
    } else {
      alert("Selecione exatamente um item para editar.");
    }
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      alert(`Excluir: ${JSON.stringify(selectedRows)}`);
    } else {
      alert("Selecione pelo menos um item para excluir.");
    }
  };

  const handleView = () => {
    if (selectedRows.length === 1) {
      alert(`Visualizar: ${JSON.stringify(selectedRows[0])}`);
    } else {
      alert("Selecione exatamente um item para visualizar.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "username", headerName: "Nome", flex: 1 },
    { field: "Email", headerName: "E-mail", flex: 1 },
  ];

  const handleRowSelectionChange = (selectedRows) => {
    setSelectedRows(selectedRows);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-start" }}>
        <Actions onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
      </div>

      <Table
        allChecked={allChecked}
        setAllChecked={setAllChecked}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        list={mockData}
        columns={columns}
        pageSize={5}
        onSelectionChange={handleRowSelectionChange}
      />
    </div>
  );
};

export default Mock;
