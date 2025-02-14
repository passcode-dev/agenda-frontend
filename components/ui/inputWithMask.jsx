import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputWithMask = ({ label, value, name, onChange, type = "text", mask }) => {
  const handleInputChange = (e) => {
    const { value } = e.target;
    // Aplica a máscara ao valor
    const maskedValue = mask ? mask(value) : value;
    onChange(name, maskedValue); // Passa o valor mascarado para o estado
  };

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={handleInputChange}
        required
      />
    </div>
  );
};

export default InputWithMask;
