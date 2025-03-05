import httpClient from "../http/httpClient";

export default class CursoService {
    async cursos(queryParams) {
        const response = await httpClient.get(`/courses?${queryParams}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return [];
    }

    async createCurso(course) {
        let obj = {
            name: course.name,
        }
        const response = await httpClient.post("/courses", obj);
        if (response.status === 201) {
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

    async buscarUsuario(id) {
        const response = await httpClient.get(`/courses?id=${id}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }

    async editCourse(id, data) {
        let obj = {
            name: data.name,
        }

        const response = await httpClient.put(`/courses/${id}`, obj);

        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }

    async removeCourse(id) {
        const response = await httpClient.delete(`/courses/${id}`);
        if (response.status === 200) {
            const dados = await response.json();
            return dados;
        }
        return false;
    }
}