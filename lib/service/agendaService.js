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

  async postDiary(payload) {
    const response = await httpClient.post("/diary", payload);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    }
    throw new Error("Erro ao salvar no diário");
  }

  async getDiary(start, end,id) {
    const response = await httpClient.get(`/diary?start=${start}&end=${end}&classroom_id=${id}`);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    }
    throw new Error("Erro ao buscar diary");
  }

  async putDiary(id, payload) {
    const response = await httpClient.put(`/diary/${id}`, payload);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    }
    throw new Error("Erro ao atualizar o diário");
  }

  async deleteDiary(entryId) {
    const response = await httpClient.delete(`/diary/${entryId}`);
  
    const jsonData = await response.json();
  
    if (response.ok) {
      console.log("Diary deleted successfully:", jsonData);
      return jsonData; // { status: "success", message: "Diary deleted successfully" }
    } else {
      throw new Error(jsonData.message || "Falha ao excluir o agendamento.");
    }
  }
  

  
  async getTeachersByName(name) {

    const response = await httpClient.get(`/teachers?name=${name}`);
    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData.data.teachers;
    }
    return [];
  }

  async getCoursesByName(name) {

    const response = await httpClient.get(`/courses?name=${name}`);
    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData.data.courses;
    }
    return [];
  }

  async getSubjectsByName(name) { //matéria

    const response = await httpClient.get(`/subjects?name=${name}`);
    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData.data.subjects;
    }
    return [];
  }

  async getClassroom() { 

    const response = await httpClient.get("/classroom");
    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData.data.classrooms;
    }
    return [];
  }


  


}
