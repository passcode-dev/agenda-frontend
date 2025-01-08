const baseUrl = 'http://localhost:8080/api';

const httpClient = {
    token: document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1"),
    get: async (path, token = false) => {
        return fetch(baseUrl + path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${httpClient.token}` : '',
            },
        });
    },
    post: async (path, data, token = false) => {
        return fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${httpClient.token}` : '',
            },
            body: JSON.stringify(data),
        });
    },
    postFormData: async (path, data, token = false) => {
        return fetch(baseUrl + path, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': token ? `Bearer ${httpClient.token}` : '',
            }
        });
    },
    put: async (path, data, token = false) => {
        return fetch(baseUrl + path, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${httpClient.token}` : '',
            },
            body: JSON.stringify(data),
        });
    },
    delete: async (path, token = false) => {
        return fetch(baseUrl + path, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${httpClient.token}` : '',
            },
        });
    },
};

export default httpClient; 