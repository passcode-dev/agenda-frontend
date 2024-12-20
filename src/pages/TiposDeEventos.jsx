import { Typography } from "@mui/material";
import Mock from "../components/tables/Mock";
export default function TiposDeEventos() {
  return (
    <div>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", color: "#007FFF", marginBottom: "20px" }}
      >
        Lista de Alunos
      </Typography>
      <Mock/>
    </div>
  );
}
