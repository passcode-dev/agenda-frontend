import { Label } from "@/components/ui/label";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import styled from "styled-components";

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
  const formattedValue = value ? dayjs(value) : null;
  
  const isValidDate = formattedValue && formattedValue.isValid();

  return (
    <div className={`flex flex-col ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      <LocalizationProviderStyled dateAdapter={AdapterDayjs}>
        <DateField
          value={isValidDate ? formattedValue : null} // Só passa uma data válida ou null
          onChange={(date) => onChange(name, date ? date.format("YYYY-MM-DD") : "")}
          format="DD/MM/YYYY"
          placeholder={placeholder}
        />
      </LocalizationProviderStyled>
    </div>
  );
};

export default DatePickerField;
