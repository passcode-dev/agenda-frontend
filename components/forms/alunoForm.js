import React from "react";
import { maskCpf, maskPhone, maskRg } from "@/lib/mask"; // Importando as máscaras
import InputWithMask from "../ui/inputWithMask";
import DatePickerField from "../ui/datePickerField";
import dayjs from "dayjs";

const AlunoForm = ({ aluno, setAlunoData }) => {
  const handleChange = (name, value) => {
    setAlunoData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form className="space-y-4">
      <InputWithMask
        label="Nome"
        value={aluno.name}
        name="name"
        onChange={handleChange}
      />
      
      <InputWithMask
        label="Último nome"
        value={aluno.last_name}
        name="last_name"  
        onChange={handleChange}
      />

      <InputWithMask
        label="Telefone"
        value={aluno.phone_number}
        name="phone_number"
        onChange={handleChange}
        mask={maskPhone} // Aplica a máscara para telefone
      />

      <InputWithMask
        label="RG"
        value={aluno.rg}
        name="rg"
        onChange={handleChange}
        mask={maskRg} // Aplica a máscara para RG
      />

      <InputWithMask
        label="CPF"
        value={aluno.cpf}
        name="cpf"
        onChange={handleChange}
        mask={maskCpf} // Aplica a máscara para CPF
      />

      <DatePickerField
        label="Data de Nascimento"
        value={aluno.birth_date ? dayjs(aluno.birth_date).format("YYYY-MM-DD") : ""} // Converte a data para o formato correto
        name="birth_date"
        onChange={handleChange}
      />

      <DatePickerField
        label="Data de Entrada"
        value={aluno.entry_date ? dayjs(aluno.entry_date).format("YYYY-MM-DD") : ""} // Converte a data para o formato correto
        name="entry_date"
        onChange={handleChange}
      />

      <DatePickerField
        label="Data de Saída"
        value={aluno.exit_date ? dayjs(aluno.exit_date).format("YYYY-MM-DD") : ""} // Converte a data para o formato correto
        name="exit_date"
        onChange={handleChange}
      />
    </form>
  );
};

export default AlunoForm;
