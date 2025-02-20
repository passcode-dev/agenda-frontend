import dayjs from "dayjs";
import httpClient from "../http/httpClient";

export default class AlunoService {
    async alunos(queryParams) {
        const response = await httpClient.get(`/students?${queryParams}`);
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
            name: data.name,
            last_name: data.last_name,
            rg: data.rg,
            phone_number: data.phone_number,
            cpf: data.cpf,
            birth_date: undefined,
            entry_date: undefined,
            exit_date: undefined
        };
    
        // Verifica se a data de nascimento é válida antes de adicionar ao obj
        const formattedBirthDate = dayjs(data.birth_date);
        if (formattedBirthDate.isValid()) {
            obj.birth_date = formattedBirthDate.format("YYYY-MM-DD");
        }
    
        // Verifica se a data de entrada é válida antes de adicionar ao obj
        const formattedEntryDate = dayjs(data.entry_date);
        if (formattedEntryDate.isValid()) {
            obj.entry_date = formattedEntryDate.format("YYYY-MM-DD");
        }
    
        // Verifica se a data de saída é válida antes de adicionar ao obj
        const formattedExitDate = dayjs(data.exit_date);
        if (formattedExitDate.isValid()) {
            obj.exit_date = formattedExitDate.format("YYYY-MM-DD");
        }
        
        const response = await httpClient.put(`/students/${Number(id)}`, obj);
        if (response.status === 200 || response.status === 201) {
            const dados = await response.json();
            return dados;
        }
    
        if (response.status === 500) {
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

    async totalStudents() {
        const response = await httpClient.get("/dash/total-students");
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }

        return false;
    }
}
