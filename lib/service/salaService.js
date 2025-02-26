import httpClient from "../http/httpClient";

export default class SalaService {
    async Salas(params) {
        const response = await httpClient.get(`/classroom?${params}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return [];
    }

    async cadastrarSala(data) {
        const response = await httpClient.post("/classroom", data);
        if (response.status === 200 || response.status === 201) {
            const data = await response.json();
            return data;
        }

        if (response.status === 500) {
            const data = await response.json();
            return data;
        }

        return false
    }

    async deletarSala(id) {
        const response = await httpClient.delete(`/classroom/${id}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }

    async editarSala(id, data) {
        const response = await httpClient.put(`/classroom/${id}`, data);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }
}