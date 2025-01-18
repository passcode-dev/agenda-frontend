import httpClient from "../http/httpClient";

export default class MateriaService {
    async Materias(page) {
        const response = await httpClient.get(`/subjects?page=${page}`);
        if (response.status === 200) {
            const data = await response.json();
            return data.data;
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

}