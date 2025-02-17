import React from "react";
import InputWithMask from "../ui/inputWithMask";

const UserForm = ({ user, setUserData }) => {
  const handleChange = (name, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form className="space-y-4">
      {console.log(user)}
      <InputWithMask
        label="Nome"
        value={user.username}
        name="username"
        onChange={handleChange}
      />

      <InputWithMask
        label="Email"
        value={user.email}
        name="email"
        onChange={handleChange}
      />
      
      <InputWithMask
        label="Senha"
        value={user.password}
        name="password"
        onChange={handleChange}
      />



    </form>
  );
};

export default UserForm;
