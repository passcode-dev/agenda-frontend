"use client";

import { useCallback, useEffect } from "react";
import InputWithMask from "../ui/inputWithMask";
import styled from "styled-components";

export default function MateriaForm({ materia, setMateriaData }) {
  const handleChange = (name, value) => {
    setMateriaData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;  
  padding: 1.5rem;
`;

const CustomInputWithMask = styled(InputWithMask)`
  margin-bottom: 16px;

  label {
    font-size: 1rem;
    font-weight: 600;
    color: #555;
    margin-bottom: 8px;
  }

  input {
    width: 100%; 
    padding: 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;

    &:focus {
      border-color: #4caf50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    &::placeholder {
      color: #aaa;
    }
  }
`;

  return (
    <StyledForm className="space-y-4">
      <CustomInputWithMask
        label="Nome"
        name="name"
        defaultValue={materia.name}
        onChange={handleChange}
      />
    </StyledForm>
  );
}
