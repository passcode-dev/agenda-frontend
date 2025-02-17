import httpClient from "../http/httpClient";

export default class MateriaService {
    async Materias(params) {
        const response = await httpClient.get(`/subjects?${params}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return [];
    }

    async cadastrarMateria(data) {
        const response = await httpClient.post("/subjects", data);
        if (response.status === 200 || response.status === 201) {
            const data = await response.json();
            return data;
        }
        return false
    }

    async deletarMateria(id) {
        const response = await httpClient.delete(`/subjects/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }

    async buscarMateria(id) {
        const response = await httpClient.get(`/subjects/${id}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }

    async editarMateria(id, data) {
        const response = await httpClient.put(`/subjects/${id}`, data);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return false;
    }
}