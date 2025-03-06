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


    async GetAulas() {
        const response = await httpClient.get(`/dash/total-monthly-classes`);
        if (response.status === 200) {
            const data = await response.json();
            return data?.data[0];
        }
        return ;
    }

}