import httpClient from "../http/httpClient";

export default class AuthService {
    async login(data) {
        let obj = {};
        if (data.emailOrUsername.includes("@")) {
            obj = {
                email: data.emailOrUsername,
                username: "",
                password: data.password
            }
        } else {
            obj = {
                email: "",
                username: data.emailOrUsername,
                password: data.password
            }
        }
        const response = await httpClient.post('/login', obj);
        if (response.status === 200 && response.status != 401) {
            const json = await response.json();
            // document.cookie = `token=${json.token}`;
            return json;
        }
        return false
    }
}