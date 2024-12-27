import React, { useState } from "react";
import styled from "styled-components";

const AlunoAddModal = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <h2>Adicionar Novo Aluno</h2>
                <form onSubmit={handleSubmit}>
                    <InputContainer>
                        <label htmlFor="username">Nome:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </InputContainer>
                    <InputContainer>
                        <label htmlFor="email">E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </InputContainer>
                    <ButtonContainer>
                        <button type="submit">Adicionar</button>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                    </ButtonContainer>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    padding: 10px 15px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    &:first-child {
      background-color: #4caf50;
      color: white;
    }
    &:last-child {
      background-color: #f44336;
      color: white;
    }
  }
`;

export default AlunoAddModal;
