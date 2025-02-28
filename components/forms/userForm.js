import React from "react";
import InputWithMask from "../ui/inputWithMask";
import styled from "styled-components";

const UserForm = ({ user, setUserData, error }) => {
  const handleChange = (name, value) => {
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <StyledForm className="space-y-4">

      {!!error && (
        <>
          <CustomAlert>
            <div>Complete todos os campos destacados!</div>
          </CustomAlert>
        </>
      )}
      <CustomInputWithMask
        label="Nome"
        defaultValue={user.username}
        name="username"
        onChange={handleChange}
        error={error}
        isRequired={true}
      />

      <CustomInputWithMask
        label="Email"
        defaultValue={user.email}
        name="email"
        onChange={handleChange}
        error={error}
        isRequired={true}
      />

      <CustomInputWithMask
        label="Senha"
        defaultValue={user.password || ''}
        name="password"
        onChange={handleChange}
        error={error}
        isRequired={true}
      />



    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.0rem;
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

const CustomAlert=styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
`;
export default UserForm;
