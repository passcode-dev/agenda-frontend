"use client";

import { useEffect } from "react";
import InputWithMask from "../ui/inputWithMask";
import SelectAutoComplete from "../ui/selectAutoComplete";
import styled from "styled-components";

export default function TurmaForm({ turma, setTurma, error }) {

  const handleChange = (name, value) => {
    setTurma((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const CustomAlert=styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
`;

  return (
    <form className="space-y-4">
      {!!error &&(
        <>
          <CustomAlert>
            <div>Complete todos os campos destacados!</div>
          </CustomAlert>
        </>
      )}
      <InputWithMask
        label="Nome"
        name="name"
        defaultValue={turma.name}
        onChange={handleChange}
        error={error}
        isRequired={true}
      />

      <SelectAutoComplete
        label="Aluno"
        value={turma.Students || []}
        setValue={(value) => setTurma({ ...turma, Students: value })}
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
