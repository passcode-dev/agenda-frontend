import httpClient from "../http/httpClient";

export default class AlunoService {
    async alunos(page = 1) {
        const response = await httpClient.get(`/students?page=${page}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados.data;
        }
        return [];
    }

    async cadastrarAluno(data) {
        let obj = {
            name: data.nome,
            rg: data.rg,
            cpf: data.cpf,
            birth_date: data.dataNascimento,
            phone_number: data.telefone
        };

        const response = await httpClient.post("/students", obj);
        if (response.status === 201 || response.status === 200) {
            return await response.json();
        }

        return false;
    }

    async deletarAluno(id) {
        let obj = {
            id: id
        }
        const response = await httpClient.delete("/students", obj);
        if (response.status === 200) {
            return true;
        }
        return false;
    }
}