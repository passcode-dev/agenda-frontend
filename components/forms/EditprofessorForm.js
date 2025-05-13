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
    border: 1px solid #ccc; 
    padding: 0;

    &.Mui-focused {
      box-shadow: none;
      border-color: initial;
    }

  }

  .MuiOutlinedInput-notchedOutline {
    border-color: white !important; /* Cor padrão da borda */
  }
`;


const CustomInputWithMask = styled(InputWithMask)`
 
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
    border: 1px solid ${({ error }) => (error ? "red" : "#ccc")};
    font-size: 1rem;
    outline: none;
  

    &::placeholder {
      color: #aaa;
    }
  }
`;
  const CustomAlert = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: red;
  `;


export default function EditProfessorForm({ professor, setProfessorData, error }) {


  const handleChange = (nome, value) => {
    setProfessorData({ ...professor, [nome]: value })
  };

  return (
    <StyledForm className="space-y-4">

      {!!error && (
        <>
          <CustomAlert>
            <div>Complete todos os campos destacados!</div>
          </CustomAlert>
        </>
      )}
      <CustomInputWithMask
        label="Nome"
        name="name"
        defaultValue={professor.name}
        onChange={handleChange}
        error={error}
        isRequired={true}
      />

      <CustomInputWithMask
        label="CPF"
        value={professor.cpf ?? ''}
        name="cpf"
        onChange={handleChange}
        mask={maskCpf}
        error={error}
        isRequired={true}
      />

      <CustomDatePicker
        label="Data de Nascimento"
        value={professor.BirthDate}
        name="birth_date"
        onChange={handleChange}
        error={error}
        isRequired={true}
      />

      <CustomInputWithMask
        label="Nome de Usuário"
        name="username"
        defaultValue={professor.username}
        onChange={handleChange}
        error={error}
        isRequired={false}
      />
      
      <CustomInputWithMask
        label="E-mail"
        name="email"
        defaultValue={professor.email}
        onChange={handleChange}
        error={error}
        isRequired={false}
      />
    </StyledForm>
  );


}

