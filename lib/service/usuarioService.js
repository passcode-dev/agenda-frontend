import httpClient from "../http/httpClient";

export default class UsuarioService {
    async usuarios(queryParams) {
        const response = await httpClient.get(`/user?${queryParams}`);
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

        if (response.status === 500) {
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

    async alterarUsuario(id, data) {
        let obj = {
            email: data.email,
            username: data.username,
            password: data.password ?? ""
        }

        const response = await httpClient.put(`/user/${id}`, obj);

        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }

    async deletarUsuario(id) {
        const response = await httpClient.delete(`/user/${id}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }
}