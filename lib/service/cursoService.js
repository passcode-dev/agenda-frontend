import httpClient from "../http/httpClient";

export default class CursoService {
    async Cursos(page) {
        const response = await httpClient.get(`/courses`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return [];
    }

    async cadastrarCurso(data) {
        const response = await httpClient.post("/courses", data);
        if (response.status === 200 || response.status === 201) {
            const data = await response.json();
            return data;
        }
        return false
    }

    async deletarCurso(id) {
        const response = await httpClient.delete(`/courses/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }

    async buscarCurso(id) {
        const response = await httpClient.get(`/courses/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }

    async editarCurso(id, data) {
        const response = await httpClient.put(`/courses/${id}`, data);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }
}