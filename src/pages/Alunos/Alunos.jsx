import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "../../components/tables/Table";
import Actions from "../../components/actions/Actions";
import SearchBar from "../../components/searchBar";
import AlunoEditModal from "./AlunoEditModal";
import AlunoAddModal from "./AlunoAddModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const mockData = [
  { id: 1, username: "John Doe", Email: "john@example.com" },
  { id: 2, username: "Jane Smith", Email: "jane@example.com" },
  { id: 3, username: "Bob Johnson", Email: "bob@example.com" },
  { id: 4, username: "Alice Brown", Email: "alice@example.com" },
  { id: 5, username: "Charlie Davis", Email: "charlie@example.com" },
];

export default function Alunos() {
  const [filteredData, setFilteredData] = useState(mockData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleEdit = () => {
    if (selectedRows.length === 1) {
      setItemToEdit(selectedRows[0]);
      setShowEditModal(true);
    } else {
      toast.error("Selecione exatamente um item para editar.");
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const handleDelete = () => {
    if (selectedRows.length > 0) {
      setShowDeleteModal(true);
    } else {
      toast.error("Selecione pelo menos um item para excluir.");
    }
  };

  const handleConfirmDelete = () => {
    const remainingData = filteredData.filter(
      (item) => !selectedRows.some((selected) => selected.id === item.id)
    );
    setFilteredData(remainingData);
    setSelectedRows([]);
    setShowDeleteModal(false);
    toast.success("Itens excluídos com sucesso!");
  };

  const handleSaveEdit = (editedItem) => {
    const updatedData = filteredData.map((item) =>
      item.id === editedItem.id ? { ...item, ...editedItem } : item
    );
    setFilteredData(updatedData);
    setShowEditModal(false);
    toast.success("Item editado com sucesso!");
  };

  const handleSaveAdd = (newItem) => {
    const newItemWithId = { ...newItem, id: filteredData.length + 1 };
    setFilteredData([...filteredData, newItemWithId]);
    setShowAddModal(false);
    toast.success("Item adicionado com sucesso!");
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
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
        <SearchBar
          data={mockData}
          searchField="username"
          placeholder="Pesquisar por nome..."
          onSearch={setFilteredData}
        />
        <Actions onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
      </div>

      <Table
        allChecked={allChecked}
        setAllChecked={setAllChecked}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        list={filteredData}
        columns={columns}
        pageSize={5}
        onSelectionChange={handleRowSelectionChange}
      />

      {showEditModal && (
        <AlunoEditModal
          selectedItem={itemToEdit}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showAddModal && (
        <AlunoAddModal
          onSave={handleSaveAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          selectedItems={selectedRows}
          onConfirm={handleConfirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
}
