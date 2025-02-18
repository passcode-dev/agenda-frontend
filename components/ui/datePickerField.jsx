import { Label } from "@/components/ui/label";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import styled from "styled-components";

dayjs.extend(utc); // Certifique-se de ativar o plugin UTC

const LocalizationProviderStyled = styled(LocalizationProvider)`
  height: 10px;
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
  .MuiInputBase-input {
    padding: 0;
  }
`;

const DatePickerField = ({
  label,
  value,
  name,
  onChange,
  className = "",
  placeholder = "DD/MM/YYYY",
}) => {
  // Força a hora para meio-dia (12:00) para evitar problemas com fuso horário
  const formattedValue = value ? dayjs(value).utc(): null;
  const isValidDate = formattedValue && formattedValue.isValid();

  return (
    <div className={`flex flex-col ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      <LocalizationProviderStyled dateAdapter={AdapterDayjs}>
        <DateField
          defaultValue={isValidDate ? formattedValue : null} // Só passa uma data válida ou null
          onChange={(date) =>
            onChange(name, date ?? '')
          }
          format="DD/MM/YYYY"
          placeholder={placeholder}
        />
      </LocalizationProviderStyled>
    </div>
  );
};

export default DatePickerField;