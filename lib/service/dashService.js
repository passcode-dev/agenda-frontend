import httpClient from "../http/httpClient";


export default class dashService{

    async GetProfTurma(params) {
        const response = await httpClient.get(`/diary?teacher_id=${params}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
        return [];
    }

}