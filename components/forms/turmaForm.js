"use client";

import { useEffect } from "react";
import InputWithMask from "../ui/inputWithMask";
import SelectAutoComplete from "../ui/selectAutoComplete";

export default function TurmaForm({ turma, setTurma }) {

  const handleChange = (name, value) => {
    setTurma((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  {console.log("turma ",turma);}

  return (
    <form className="space-y-4">
      <InputWithMask
        label="Nome"
        name="name"
        value={turma.name}
        onChange={handleChange}
      />

      <SelectAutoComplete
        label="Aluno"
        value={turma.Students || []}  // Garantir que seja um array vazio se students for undefined
        setValue={(value) => setTurma({ ...turma, Students: value })}  // Atualizando os estudantes
        api="/students"
        labelKey="name"
        valueKey="id"
        filterParam="name"
        arrayKey="students"
        renderOption={(item) => `${item.name} ${item.last_name}`}
        keyExtractor={(item) => item.id}
      />
    </form>
  );
}
