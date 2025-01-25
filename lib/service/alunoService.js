import httpClient from "../http/httpClient";

export default class AlunoService {
    async alunos(page = 1) {
        const response = await httpClient.get(`/students?page=${page}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return [];
    }

    async cadastrarAluno(data) {
        const response = await httpClient.post("/students", data);
        if (response.status === 201 || response.status === 200) {
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

    async deletarAluno(id) {
        let obj = {
            id: id
        }
        const response = await httpClient.delete("/students", obj);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }

    async editarAluno(id, data) {
        let obj = {
            id: Number(id),
            name: data.name,
            rg: data.rg,
            cpf: data.cpf,
            birth_date: data.birth_date,
            phone_number: data.phone_number
        };
        const response = await httpClient.put("/students", obj);
        if (response.status === 200 || response.status === 201) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }

    async buscarAluno(id) {
        const response = await httpClient.get(`/students?id=${id}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }

        return false;
    }
}