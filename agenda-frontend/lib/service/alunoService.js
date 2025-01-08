import httpClient from "../http/httpClient";

export default class AlunoService {
    async alunos() {
        // const response = await httpClient.get("/alunos");
        // if (response.ok) {
        //     return await response.json();
        // }
        return [];
    }

    async cadastrarAluno(data) {
        // let obj = {
        //     nome: data.nome,
        //     email: data.email,
        //     telefone: data.telefone,
        //     dataNascimento: data.dataNascimento,
        // };
        // const response = await httpClient.post("/alunos", obj);
        // if (response.status === 201 || response.status === 200) {
        //     return await response.json();
        // }
        return true;
    }
}