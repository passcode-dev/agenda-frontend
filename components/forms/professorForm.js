"use client";

import { maskCpf } from "@/lib/mask";
import InputWithMask from "../ui/inputWithMask";
import dayjs from "dayjs";

import { useState } from "react";
import DatePickerField from "../ui/datePickerField";
import styled from "styled-components";

export default function ProfessorForm({ professor, setProfessorData }) {

  const handleChange = (name, value) => {
    setProfessorData((prevState) => ({
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
    width: 100%;  /* Ocupa toda a largura disponível */
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
        defaultValue={professor.name}
        onChange={handleChange}
      />

      <CustomInputWithMask
        label="CPF"
        value={professor.cpf ?? ''}
        name="cpf"
        onChange={handleChange}
        mask={maskCpf}
      />
  
      <DatePickerField
        label="Data de Nascimento"
        value={professor.BirthDate}
        name="birth_date"
        onChange={handleChange}
      />
    </StyledForm>
  );
}
