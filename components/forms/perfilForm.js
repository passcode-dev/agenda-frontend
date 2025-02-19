import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { InputLabel } from "@mui/material";
import styled from "styled-components";
import InputWithMask from "../ui/inputWithMask";
import InputPassword from "../ui/inputPassword";


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

  
export default function UsuarioForm({ setUsuario, usuarios }) {

  
  const handleChange = (name, value) => {

    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <StyledForm>
      <CustomInputWithMask
        label="Nome"
        defaultValue={usuarios.name ?? ''}
        name="name"
        onChange={handleChange}
      />

      <CustomInputWithMask
        label="Email"
        defaultValue={usuarios.email ?? ''}
        name="last_name"
        onChange={handleChange}
      />

      <InputPassword
        label="Senha"
        onChange={handleChange}
        defaultValue={usuarios.password ?? ''}
      />
    </StyledForm>
  );
}