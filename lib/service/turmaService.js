import httpClient from "../http/httpClient";

export default class TurmaService {
    async Turmas(queryParams) {
        const response = await httpClient.get(`/class?${queryParams}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return [];
    }

    async cadastrarTurma(data) {
        const response = await httpClient.post("/class", data);
        if (response.status === 200 || response.status === 201) {
            const data = await response.json();
            return data;
        }
        return false
    }

    async deletarTurma(id) {
        const response = await httpClient.delete(`/class/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }

    async buscarTurma(id) {
        const response = await httpClient.get(`/class/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }

    async editarTurma(id, data) {
        const response = await httpClient.put(`/class/${id}`, data);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }
}