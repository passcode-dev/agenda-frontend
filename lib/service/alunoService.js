import httpClient from "../http/httpClient";

export default class AlunoService {
    async alunos() {
        const response = await httpClient.get("/students");
        if (response.ok) {
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
}