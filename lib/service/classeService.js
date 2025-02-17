import httpClient from "../http/httpClient";

export default class ClasseService {
    async classes(params) {
        const response = await httpClient.get(`/classroom?${params}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return [];
    }

    async cadastrarClasse(data) {
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

    async deletarClasse(id) {
        const response = await httpClient.delete(`/classroom/${id}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }

    async editarClasse(id, data) {
        const response = await httpClient.put(`/classroom/${id}`, data);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }
}