"use client";

import InputWithMask from "../ui/inputWithMask";

export default function ClasseForm({ classe, setClasseData }) {
  const handleChange = (name, value) => {
    setClasseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form className="space-y-4">
      <InputWithMask
        label="Nome"
        name="name"
        defaultValue={classe.name}
        onChange={handleChange}
      />
    </form>
  );
}
