"use client";

import { maskCpf } from "@/lib/mask";
import InputWithMask from "../ui/inputWithMask";
import DatePickerField from "../ui/datePickerField";
import styled from "styled-components";

const StyledForm = styled.form`
display: flex;
flex-direction: column;
gap: 1.25rem;
width: 100%;  
padding: 1.5rem;
`;


const CustomDatePicker = styled(DatePickerField)`
  .MuiOutlinedInput-root {
    height: 40px;
    border: 1px solid #e5e5e5; 
    padding: 0;

    &.Mui-focused {
      box-shadow: none;
      border-color: initial;
      border: 1px solid black;
    }

  }

  .MuiOutlinedInput-notchedOutline {
    border-color: white !important; /* Cor padrão da borda */
  }
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

  &::placeholder {
    color: #aaa;
  }
}
`;

export default function ProfessorForm({ professor, setProfessorData }) {

  const handleChange = (name, value) => {
    setProfessorData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


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

      <CustomDatePicker
        label="Data de Nascimento"
        value={professor.BirthDate}
        name="birth_date"
        onChange={handleChange}
      />

    </StyledForm>
  );
}
