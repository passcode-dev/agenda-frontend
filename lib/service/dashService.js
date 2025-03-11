import httpClient from "../http/httpClient";

export default class dashService {
  async GetProfTurma(params) {
    try {
      const response = await httpClient.get(`/diary?teacher_id=${params}`);
      if (response.status === 200) {
        const data = await response.json();
        return data;
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar dados do professor por turma:", error);
      return [];
    }
  }

  // Recebe um parâmetro opcional 'query' (ex.: "?start_date=2025-03-01&end_date=2025-03-31")
  async GetAulas(query = "") {
    try {
      const response = await httpClient.get(`/dash/total-monthly-classes${query}`);
      if (response.status === 200) {
        const data = await response.json();
        return data?.data[0];
      }
    } catch (error) {
      console.error("Erro ao buscar total de aulas mensais:", error);
    }
    return null;
  }

  // Obtém a distribuição de aulas de reposição x aulas normais, com filtro de data opcional
  async GetMakeupClasses(query = "") {
    try {
      const response = await httpClient.get(`/dash/makeup-classes${query}`);
      if (response.status === 200) {
        const data = await response.json();
        return data?.data;
      }
    } catch (error) {
      console.error("Erro ao buscar dados de aulas de reposição:", error);
    }
    return { makeup_classes: 0, normal_classes: 0 };
  }

  // Obtém a distribuição de aulas por curso, com filtro de data opcional
  async GetClassesByCourse(query = "") {
    try {
      const response = await httpClient.get(`/dash/classes-by-course${query}`);
      if (response.status === 200) {
        const data = await response.json();
        return data?.data;
      }
    } catch (error) {
      console.error("Erro ao buscar aulas por curso:", error);
    }
    return [];
  }
}
