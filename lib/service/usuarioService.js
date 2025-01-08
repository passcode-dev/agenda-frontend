import httpClient from "../http/httpClient";

export default class UsuarioService {
    async usuarios() {
        // const response = await httpClient.get("/usuarios");
        // if (response.status === 200) {
        //     return await response.json();
        // }
        return [];
    }

    async CadastrarUsuario(usuario) {
        let obj = {
            email: usuario.email,
            username: usuario.username,
            senha: usuario.password
        }
        const response = await httpClient.post("/users", obj);
        if (response.status === 201) {
            return await response.json();
        }
        return false;
    }
}