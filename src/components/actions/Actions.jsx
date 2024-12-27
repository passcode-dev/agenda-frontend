import React from "react";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Add } from "@mui/icons-material";

const btnStyle = {
  margin: "0 8px",
  borderRadius: "8px",
  padding: "6px 16px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
};

const Actions = ({ onEdit, onDelete, onView, onAdd }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<Add />}
        onClick={onAdd}
        style={btnStyle}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        Adicionar
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="small"
        startIcon={<EditIcon />}
        onClick={onEdit}
        style={btnStyle}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        Editar
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={onDelete}
        style={{
          ...btnStyle,
          backgroundColor: "#d32f2f",
          color: "white",
        }}
        onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
      >
        Excluir
      </Button>
    </div>
  );
};

export default Actions;
