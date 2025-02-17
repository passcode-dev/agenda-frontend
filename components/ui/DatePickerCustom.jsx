import { Label } from "@/components/ui/label";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";

const LocalizationProviderStyled = styled(LocalizationProvider)`
  .MuiInputLabel-root {
    font-size: 14px;
  }
  .MuiInputBase-root {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
    width: 100%;
  }
`;

const DatePickerCustom = ({
  label,
  value,
  name,
  onChange,
  className = "",
  placeholder = "DD/MM/YYYY",
}) => {
  // Garantimos que apenas a data seja usada, sem conversão automática para UTC
  const formattedValue = value ? dayjs(value).format("YYYY-MM-DD") : "";

  return (
    <div className={`flex flex-col ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      <LocalizationProviderStyled dateAdapter={AdapterDayjs}>
        <DateField
          value={formattedValue ? dayjs(formattedValue) : null}
          onChange={(date) => {
            if (date && date.isValid()) {
              // Salvar apenas a data no formato correto (YYYY-MM-DD) sem horário e sem UTC
              onChange(name, date.format("YYYY-MM-DD"));
            } else {
              onChange(name, ""); // Permite limpar o campo
            }
          }}
          format="DD/MM/YYYY"
          placeholder={placeholder}
        />
      </LocalizationProviderStyled>
    </div>
  );
};

export default DatePickerCustom;
