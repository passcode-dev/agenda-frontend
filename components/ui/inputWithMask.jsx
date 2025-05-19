import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputWithMask = ({ label, value, defaultValue, name, onChange, type = "text", mask, error, className="", isRequired,placeholder}) => {
  const handleInputChange = (e) => {
    const { value } = e.target;

    // Aplica a máscara ao valor
    const maskedValue = mask ? mask(value) : value;
    onChange(name, maskedValue); // Passa o valor mascarado para o estado
  };

  return (
    <div className={className}>
      <Label htmlFor={name}>
        {label}<span className="text-red-500">{isRequired && " *"}</span>
        </Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={handleInputChange}
        style={{
          borderColor: error && isRequired && !defaultValue && !value ? 'red' : '#ccc',
        }}
        required
      />
    </div>
  );
};

export default InputWithMask;
