"use client";

import { useCallback, useEffect } from "react";
import InputWithMask from "../ui/inputWithMask";

export default function MateriaForm({ materia, setMateriaData }) {
  const handleChange = (name, value) => {
    setMateriaData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form className="space-y-4">
      {/* Input para o nome da matéria */}
      <InputWithMask
        label="Nome"
        name="name"
        defaultValue={materia.name}
        onChange={handleChange}
      />
    </form>
  );
}
