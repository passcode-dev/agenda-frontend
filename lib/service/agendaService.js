import httpClient from "../http/httpClient";

export default class AgendaService {
  async getStudentsByName(name) {
    const response = await httpClient.get(`/students?name=${name}`);
    if (response.status === 200) {
      const jsonData = await response.json();

      return jsonData.data.students;
    }
    // Se der algum erro ou não retornar 200, retorne array vazio
    return [];
  }

  async getSalasByName(name) {

    const response = await httpClient.get(`/class?name=${name}`);
    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData.data.classes;
    }
    return [];
  }

  async getTeachersByName(name) {

    const response = await httpClient.get(`/teachers?name=${name}`);
    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData.data.teachers;
    }
    return [];
  }

  


}
