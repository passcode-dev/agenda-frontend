import httpClient from "../http/httpClient";

export default class UsuarioService {
    async usuarios() {
        const response = await httpClient.get("/user");
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return [];
    }

    async CadastrarUsuario(usuario) {
        let obj = {
            email: usuario.email,
            username: usuario.username,
            password: usuario.password
        }
        const response = await httpClient.post("/user", obj);
        if (response.status === 201) {
            const dados = await response.json();
            return dados;
        }

        if (response.status === 409) {
            const dados = await response.json();
            return dados;
        }

        return false;
    }

    async buscarUsuario(id) {
        const response = await httpClient.get(`/user?id=${id}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }

    async alterarUsuario(id) {
        let obj = {
            email: usuario.email,
            username: usuario.username,
            password: usuario.password
        }
        
        const response = await httpClient.put(`/user?id=${id}`, {
            body: JSON.stringify(obj)
        });

        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }
}