import httpClient from "../http/httpClient";

export default class ProfessoresService {
    async Professores(page) {
        const response = await httpClient.get(`/teachers?page=${page}`);
        if (response.status === 200) {
            const data = await response.json();
            return data.data;
        }
        return [];
    }

    async cadastrarProfessor(data) {
        const response = await httpClient.post("/teachers", data);
        if (response.status === 200 || response.status === 201) {
            return true;
        }
        return false
    }

    async deletarProfessor(id) {
        let obj = {
            id: id
        }
        const response = await httpClient.delete("/teachers", obj);
        if (response.status === 200) {
            return true;
        }
        return false;
    }

    async buscarProfessor(id) {
        const response = await httpClient.get(`/teachers/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            return data.data;
        }
        return [];
    }

    async editarProfessor(id, data) {
        let obj = {
            id: id,
            ...data
        }
        const response = await httpClient.put("/teachers", obj);
        if (response.status === 200) {
            return true;
        }
        return false;
    }
}