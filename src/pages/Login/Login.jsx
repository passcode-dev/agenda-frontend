import React, { useState } from 'react';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

// Estilizações
const Background = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(#135884, rgba(19, 89, 132, 0.575)), url('../pictures/vidrocanva.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-family: "Limelight";
  font-weight: 400;
  font-style: normal;
  color: #135884;
  font-size: 50px;
  margin-bottom: 30px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 20px;
  width: 600px;
  height: 400px;
`;

const InputLogin = styled.input`
  border: none;
  border-bottom: 1px solid black;
  padding: 10px;
  margin-bottom: 20px;
  font-family: 'Inter', sans-serif;
  width: 300px;

  &:focus {
    outline: none;
    border-bottom: 1px solid black;
  }
`;

const Button = styled.button`
  margin-top: 40px;
  border: none;
  background-color: #135884;
  color: white;
  border-radius: 5px;
  width: 90px;
  height: 40px;
  font-family: 'Inter', sans-serif;
  transition: 0.2s color ease-in-out;

  text-align: center;
  &:hover {
    cursor: pointer;
    color: rgba(255, 255, 255, 0.781);
  }

  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                console.log("Login bem-sucedido");
                const data = await response.json();
                console.log(data);  
                toast.success('Login realizado com sucesso!');
            } else {
                toast.error('Erro ao fazer login. Verifique suas credenciais.');
            }
        } catch (error) {
            toast.error('Erro ao conectar ao servidor.');
            console.log('Error: ', error);
        }
    };

    return (
        <Background>
            <LoginContainer>
                <Title>Login</Title>
                <form
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        login();
                    }}
                >
                    <div className='text-center'>
                        <InputLogin
                            type="text"
                            placeholder="Login"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <InputLogin
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit">Entrar</Button>
                </form>
            </LoginContainer>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Background>
    );
}
