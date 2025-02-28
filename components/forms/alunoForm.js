import React from "react";
import { maskCpf, maskPhone, maskRg } from "@/lib/mask";
import styled from "styled-components";
import InputWithMask from "../ui/inputWithMask";
import DatePickerField from "../ui/datePickerField";

const AlunoForm = ({ aluno, setAlunoData, error }) => {
  const handleChange = (name, value) => {
    setAlunoData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <StyledForm>

      {!!error &&(
        <>
          <CustomAlert>
            <div>Complete todos os campos destacados!</div>
          </CustomAlert>
        </>
      )}


      <CustomInputWithMask
        label="Nome"
        defaultValue={aluno.name}
        name="name"
        onChange={handleChange}
        error={error}
        isRequired={true}
      />
      
      <CustomInputWithMask
        label="Último nome"
        defaultValue={aluno.last_name}
        name="last_name"
        onChange={handleChange}
        error={error}
        isRequired={true}
      />

      <CustomInputWithMask
        label="Telefone"
        value={aluno.phone_number ?? ''}
        name="phone_number"
        onChange={handleChange}
        mask={maskPhone}
      />

      <CustomInputWithMask
        label="RG"
        value={aluno.rg}
        name="rg"
        onChange={handleChange}
        mask={maskRg}
        error={error}
        isRequired={true}
      />

      <CustomInputWithMask
        label="CPF"
        value={aluno.cpf ?? ''}
        name="cpf"
        onChange={handleChange}
        mask={maskCpf}
        error={error}
        isRequired={true}
      />

      <CustomDatePicker
        label="Data de Nascimento"
        value={aluno.birth_date ?? ''}
        name="birth_date"
        onChange={handleChange}
        error={error}
        isRequired={true}
      />

      <CustomDatePicker
        label="Data de Entrada"
        value={aluno.entry_date ?? ''}
        name="entry_date"
        onChange={handleChange}
        error={error}
        isRequired={true}
      />

      <CustomDatePicker
        label="Data de Saída"
        value={aluno.exit_date ?? ''}
        name="exit_date"
        onChange={handleChange}
        
      />
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;  
  padding: 1.5rem;
`;

const CustomAlert=styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
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

const CustomDatePicker = styled(DatePickerField)`
  .MuiOutlinedInput-root {
    height: 40px;
    border: 1px solid #e5e5e5; 
    padding: 0;
    border-radius: 4px;

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

export default AlunoForm;
