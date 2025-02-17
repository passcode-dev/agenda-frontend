"use client";

import { maskCpf } from "@/lib/mask";
import InputWithMask from "../ui/inputWithMask";
import dayjs from "dayjs";
import DatePickerCustom from "../ui/DatePickerCustom";
import { useState } from "react";

export default function ProfessorForm({ professor, setProfessorData }) {
  // Se a data vier nula ou inválida, ajusta para string vazia
  const [birthDate, setBirthDate] = useState(professor?.BirthDate || "");

  const handleChange = (name, value) => {
    setProfessorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form className="space-y-4">
      <InputWithMask
        label="Nome"
        name="name"
        value={professor.name}
        onChange={handleChange}
      />

      <InputWithMask
        label="CPF"
        value={professor.cpf}
        name="cpf"
        onChange={handleChange}
        mask={maskCpf}
      />
  
      <DatePickerCustom
        label="Data de Nascimento"
        value={birthDate}
        name="BirthDate"
        onChange={(name, value) => {
          setBirthDate(value); // Atualiza estado local
          handleChange(name, value); // Atualiza estado do formulário
        }}
      />
    </form>
  );
}
