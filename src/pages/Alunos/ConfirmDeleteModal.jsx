import React from "react";
import styled from "styled-components";

const ConfirmDeleteModal = ({ selectedItems, onConfirm, onClose }) => {
    return (
        <ModalOverlay>
            <ModalContent>
                <h2>Confirmar Exclusão</h2>
                <p>
                    Você tem certeza que deseja excluir os seguintes itens?
                </p>
                <ul>
                    {selectedItems.map((item) => (
                        <li key={item.id}>
                            {item.username} ({item.Email})
                        </li>
                    ))}
                </ul>
                <ButtonContainer>
                    <button onClick={onConfirm}>Confirmar</button>
                    <button onClick={onClose}>Cancelar</button>
                </ButtonContainer>
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  button {
    padding: 10px 15px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    &:first-child {
      background-color: #f44336;
      color: white;
    }
    &:last-child {
      background-color: #ccc;
      color: black;
    }
  }
`;

export default ConfirmDeleteModal;
