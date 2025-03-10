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
  
      // Captura o status
      if (response.status === 409) {
        // Conflito
        const errorData = await response.json();
        // Joga um erro com o message e anexa o data completo para poder exibir depois
        const err = new Error(errorData.message || "Conflito de agendamento");
        err.conflictData = errorData.data; // Aqui guardamos os dados do conflito
        err.status = 409;
        throw err;
      }
  
      if (response.ok) {
        const jsonData = await response.json();
        return jsonData;
      }
  
      // Caso não seja 409 mas também não seja OK
      let errorMessage = "Erro ao salvar no diário";
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // ignora
      }
      throw new Error(errorMessage);
    }
  
    // ... e assim por diante para os outros métodos
  
  

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
