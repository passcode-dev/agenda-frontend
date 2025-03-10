"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react"; // Ícones de fechar e alerta
import AgendaService from "@/lib/service/agendaService";
import { useToast } from "@/hooks/use-toast";

export default function ModalAgendamento({
  isModalOpen,
  onClose,
  selectedType,
  setSelectedType,
  eventDetails,
  setEventDetails,
  handleToggleDay,
  selectedClassroom,
  onDiaryUpdated, // Callback para atualizar a agenda após salvar/alterar
}) {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [teacherSearchText, setTeacherSearchText] = useState("");
  const [teacherSearchResults, setTeacherSearchResults] = useState([]);

  const [subjectsSearchText, setSubjectsearchText] = useState("");
  const [subjectsSearchResults, setSubjectsSearchResults] = useState([]);

  const [coursesSearchText, setCoursesearchText] = useState("");
  const [coursesSearchResults, setCoursesSearchResults] = useState([]);

  // Para exibir sub-modal de conflito
  const [conflictData, setConflictData] = useState(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  const { toast } = useToast();

  // Efeito para detectar automaticamente se é aluno ou turma (ao editar)
  useEffect(() => {
      if (eventDetails?.id) {
        
         // Se existir "class_id" (não zero), define como turma; caso contrário, aluno.
         if (eventDetails.class_id && eventDetails.class_id !== 0) {
           setSelectedType("turma");
         } if (eventDetails.student_id && eventDetails.student_id !== 0) {
         
           setSelectedType("aluno");
         }
       }

    }, [eventDetails?.id]);
    

  // Atualiza o classroom_id com base no selectedClassroom
  useEffect(() => {
    if (selectedClassroom && selectedClassroom.id) {
      setEventDetails((prev) => ({ ...prev, classroom_id: selectedClassroom.id }));
    }
  }, [selectedClassroom, setEventDetails]);

  // ---------- BUSCAS ----------

  const handleSearchName = async (nome) => {
    if (nome.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const agendaService = new AgendaService();
      if (selectedType === "aluno") {
        const students = await agendaService.getStudentsByName(nome);
        const mapped = (students ?? []).map((s) => ({
          id: s.id,
          label: `${s.name} ${s.last_name}`,
        }));
        setSearchResults(mapped);
      } else if (selectedType === "turma") {
        const salas = await agendaService.getSalasByName(nome);
        const mapped = (salas ?? []).map((c) => ({
          id: c.id,
          label: c.name,
        }));
        setSearchResults(mapped);
      }
    } catch (error) {
      console.error("Erro ao buscar nomes:", error);
      setSearchResults([]);
    }
  };

  const handleSearchTeacher = async (nome) => {
    if (nome.length < 2) {
      setTeacherSearchResults([]);
      return;
    }
    try {
      const agendaService = new AgendaService();
      const teachers = await agendaService.getTeachersByName(nome);
      const mapped = (teachers ?? []).map((t) => ({
        id: t.id,
        label: `${t.name}`,
      }));
      setTeacherSearchResults(mapped);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
      setTeacherSearchResults([]);
    }
  };

  const handleSearchSubject = async (nome) => {
    if (nome.length < 2) {
      setSubjectsSearchResults([]);
      return;
    }
    try {
      const agendaService = new AgendaService();
      const subjects = await agendaService.getSubjectsByName(nome);
      const mapped = (subjects ?? []).map((s) => ({
        id: s.id,
        label: `${s.name}`,
      }));
      setSubjectsSearchResults(mapped);
    } catch (error) {
      console.error("Erro ao buscar matérias:", error);
      setSubjectsSearchResults([]);
    }
  };

  const handleSearchCourse = async (nome) => {
    if (nome.length < 2) {
      setCoursesSearchResults([]);
      return;
    }
    try {
      const agendaService = new AgendaService();
      const courses = await agendaService.getCoursesByName(nome);
      const mapped = (courses ?? []).map((c) => ({
        id: c.id,
        label: `${c.name}`,
      }));
      setCoursesSearchResults(mapped);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
      setCoursesSearchResults([]);
    }
  };

  // ---------- SELEÇÕES E REMOÇÕES ----------

  const handleSelectItem = (item) => {
    if (selectedType === "aluno") {
      setEventDetails({
        ...eventDetails,
        selectedItems: [item],
      });
    } else {
      const exists = (eventDetails.selectedItems ?? []).some((i) => i.id === item.id);
      if (!exists) {
        setEventDetails({
          ...eventDetails,
          selectedItems: [...(eventDetails.selectedItems ?? []), item],
        });
      }
    }
    setSearchText("");
    setSearchResults([]);
  };

  const removeItem = (id) => {
    setEventDetails({
      ...eventDetails,
      selectedItems: (eventDetails.selectedItems ?? []).filter((i) => i.id !== id),
    });
  };

  const handleSelectTeacherItem = (item) => {
    setEventDetails({ ...eventDetails, selectedTeacher: item });
    setTeacherSearchText("");
    setTeacherSearchResults([]);
  };

  const removeTeacher = () => {
    setEventDetails({ ...eventDetails, selectedTeacher: null });
  };

  const handleSelectCourse = (item) => {
    setEventDetails({ ...eventDetails, selectedCourse: item });
    setCoursesearchText("");
    setCoursesSearchResults([]);
  };

  const removeCourse = () => {
    setEventDetails({ ...eventDetails, selectedCourse: null });
  };

  const handleSelectSubjectItem = (item) => {
    setEventDetails({ ...eventDetails, selectedSubject: item });
    setSubjectsearchText("");
    setSubjectsSearchResults([]);
  };

  const removeSubject = () => {
    setEventDetails({ ...eventDetails, selectedSubject: null });
  };

  // ---------- ENVIO (POST/PUT) ----------

  const handleSubmitDiary = async () => {
    const dayMap = {
      seg: "MON",
      ter: "TUE",
      qua: "WED",
      qui: "THU",
      sex: "FRI",
      sab: "SAT",
      dom: "SUN",
    };

    const payloadBase = {
      classroom_id: eventDetails.classroom_id || (selectedClassroom ? selectedClassroom.id : null),
      teacher_id: eventDetails.selectedTeacher ? eventDetails.selectedTeacher.id : null,
      status_id: 1,
      course_id: eventDetails.selectedCourse ? eventDetails.selectedCourse.id : null,
      subject_id: eventDetails.selectedSubject ? eventDetails.selectedSubject.id : null,
      notes: eventDetails.notes || "",
      is_makeup_class: eventDetails.reposicao,
    };

    if (selectedType === "aluno") {
      payloadBase.student_id =
        eventDetails.selectedItems && eventDetails.selectedItems[0]
          ? eventDetails.selectedItems[0].id
          : null;
    } else {
      payloadBase.class_id =
        eventDetails.selectedItems && eventDetails.selectedItems[0]
          ? eventDetails.selectedItems[0].id
          : null;
    }

    // Aula recorrente
    if (eventDetails.recorrente) {
      payloadBase.is_recurring = true;
      if (!eventDetails.id && eventDetails.days && eventDetails.days.length > 1) {
        // Criação com múltiplos dias
        const promises = eventDetails.days.map((day) => {
          const dayFormatted = dayMap[day.toLowerCase()] || "";
          const payload = {
            ...payloadBase,
            recurrence_pattern: `${dayFormatted}@${eventDetails.inicio}-${eventDetails.fim}`,
          };
          const agendaService = new AgendaService();
          return agendaService.postDiary(payload);
        });
        const responses = await Promise.all(promises);
        return responses;
      } else {
        // Modo edição ou só um dia
        const selectedDay =
          eventDetails.days && eventDetails.days.length > 0
            ? eventDetails.days[0].toLowerCase()
            : "";
        const dayFormatted = dayMap[selectedDay] || "";
        payloadBase.recurrence_pattern = `${dayFormatted}@${eventDetails.inicio}-${eventDetails.fim}`;
      }
    } else {
      // Não recorrente
      payloadBase.is_recurring = false;
      payloadBase.start_time =
        eventDetails.date && eventDetails.inicio
          ? new Date(eventDetails.date + "T" + eventDetails.inicio + ":00Z").toISOString()
          : null;
      payloadBase.end_time =
        eventDetails.date && eventDetails.fim
          ? new Date(eventDetails.date + "T" + eventDetails.fim + ":00Z").toISOString()
          : null;
    }

    console.log("Payload enviado para /diary:", payloadBase);

    const agendaService = new AgendaService();
    let data;
    if (eventDetails.id) {
      // Edição
      data = await agendaService.putDiary(eventDetails.id, payloadBase);
    } else if (!eventDetails.recorrente || (eventDetails.recorrente && eventDetails.days.length === 1)) {
      // Criação normal ou recorrente de apenas um dia
      data = await agendaService.postDiary(payloadBase);
    }
    console.log("Resposta recebida da API /diary:", data);
    return data;
  };

  // ---------- VALIDAÇÃO E TRATAMENTO DE CONFLITO ----------

  // Submodal de conflito
  function ConflictModal() {
    if (!conflictData) return null;

    const {
      classroom,
      teacher,
      student,
      class: classData,
      subject,
      course,
      notes,
      is_makeup_class,
      start_time,
      end_time,
    } = conflictData;

    const isTurma = classData && classData.id !== 0;
    const participantLabel = isTurma ? "Turma" : "Aluno";
    const participantName = isTurma
      ? classData?.name
      : student
      ? `${student.name} ${student.last_name}`
      : "";

    // Formata horário
    let horarioStr = "";
    if (start_time && end_time) {
      const dtStart = new Date(start_time);
      const dtEnd = new Date(end_time);
      const startHH = String(dtStart.getHours()).padStart(2, "0");
      const startMM = String(dtStart.getMinutes()).padStart(2, "0");
      const endHH = String(dtEnd.getHours()).padStart(2, "0");
      const endMM = String(dtEnd.getMinutes()).padStart(2, "0");
      horarioStr = `${startHH}:${startMM} - ${endHH}:${endMM}`;
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-80 p-4 rounded shadow-lg relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConflictModal(false)}
          >
            <X size={18} />
          </button>
          <div className="flex items-center mb-3">
            <AlertTriangle className="text-red-500 mr-2" />
            <h2 className="font-bold text-lg">Conflito de Horário</h2>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            Já existe uma aula marcada nesse horário:
          </p>
          <div className="text-sm space-y-1">
            <div><strong>Sala:</strong> {classroom?.name}</div>
            <div><strong>Professor:</strong> {teacher?.name}</div>
            <div>
              <strong>{participantLabel}:</strong> {participantName}
            </div>
            <div><strong>Matéria:</strong> {subject?.name}</div>
            <div><strong>Curso:</strong> {course?.name}</div>
            {is_makeup_class && <div className="font-bold">Aula de Reposição</div>}
            {notes && <div className="italic">Obs: {notes}</div>}
            {horarioStr && <div><strong>Horário:</strong> {horarioStr}</div>}
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => setShowConflictModal(false)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const validateAndSaveEvent = async () => {
    // Faz as validações básicas
    if (!eventDetails.selectedItems || eventDetails.selectedItems.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione um Aluno/Turma a partir das sugestões!",
        variant: "destructive",
        autoClose: 3000,
      });
      return;
    }
    if (!eventDetails.selectedTeacher) {
      toast({
        title: "Erro",
        description: "Selecione um Professor a partir das sugestões!",
        variant: "destructive",
        autoClose: 3000,
      });
      return;
    }
    if (!eventDetails.selectedCourse) {
      toast({
        title: "Erro",
        description: "Selecione um Curso a partir das sugestões!",
        variant: "destructive",
        autoClose: 3000,
      });
      return;
    }
    if (!eventDetails.selectedSubject) {
      toast({
        title: "Erro",
        description: "Selecione uma Matéria a partir das sugestões!",
        variant: "destructive",
        autoClose: 3000,
      });
      return;
    }
    if (!eventDetails.date) {
      toast({
        title: "Erro",
        description: "Selecione a data do agendamento!",
        variant: "destructive",
        autoClose: 3000,
      });
      return;
    }
    if (!eventDetails.inicio) {
      toast({
        title: "Erro",
        description: "Selecione o horário de início!",
        variant: "destructive",
        autoClose: 3000,
      });
      return;
    }
    if (!eventDetails.fim) {
      toast({
        title: "Erro",
        description: "Selecione o horário de término!",
        variant: "destructive",
        autoClose: 3000,
      });
      return;
    }

    // Tenta salvar
    try {
      await handleSubmitDiary();
      // Se deu certo, limpa
      setEventDetails({
        turmaAluno: "",
        curso: "",
        professor: "",
        inicio: "",
        fim: "",
        reposicao: false,
        recorrente: false,
        days: [],
        notes: "",
        selectedItems: [],
        selectedTeacher: null,
        selectedCourse: null,
        selectedSubject: null,
        date: "",
        classroom_id: eventDetails.classroom_id,
      });
      onClose();
      toast({
        title: "Sucesso",
        description: eventDetails.id ? "Evento atualizado com sucesso!" : "Evento agendado com sucesso!",
        variant: "success",
        autoClose: 3000,
      });
      if (typeof onDiaryUpdated === "function") {
        onDiaryUpdated();
      }
    } catch (error) {
      // Se for 409, pegamos os dados do conflito e abrimos submodal
      if (error.status === 409 && error.conflictData) {
        setConflictData(error.conflictData);
        setShowConflictModal(true);
      } else {
        // Caso não seja conflito
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
          autoClose: 3000,
        });
      }
    }
  };

  if (!isModalOpen) return null;

  return (
    <>
      {/* Modal Principal */}
      <div
        className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300"
        onClick={onClose}
      >
        <div
          className="bg-white p-8 rounded-lg w-3/4 max-w-4xl shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão de fechar */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:text-gray-700 transition"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {eventDetails.id ? "Editar Agendamento" : "Novo Agendamento"}
          </h2>

          {/* Organização dos inputs em duas colunas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Checkbox (Radio) de Tipo de Usuário */}
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Tipo de Usuário:</p>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="aluno"
                    checked={selectedType === "aluno"}
                    onChange={() => {
                      setSelectedType("aluno");
                      setEventDetails({ ...eventDetails, selectedItems: [] });
                    }}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Aluno</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="turma"
                    checked={selectedType === "turma"}
                    onChange={() => {
                      setSelectedType("turma");
                      setEventDetails({ ...eventDetails, selectedItems: [] });
                    }}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Turma</span>
                </label>
              </div>
            </div>

            {/* Aluno/Turma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedType === "aluno" ? "Aluno" : "Turma"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Digite o nome do ${selectedType === "aluno" ? "Aluno" : "Turma"}`}
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    handleSearchName(e.target.value);
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchResults.length > 0 && (
                  <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto z-10">
                    {searchResults.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {(eventDetails.selectedItems ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(eventDetails.selectedItems ?? []).map((item) => (
                    <div key={item.id} className="bg-gray-200 px-2 py-1 rounded flex items-center">
                      <span className="mr-2 text-sm">{item.label}</span>
                      <button onClick={() => removeItem(item.id)} className="text-red-600 text-sm font-bold">
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Professor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o nome do Professor"
                  value={teacherSearchText}
                  onChange={(e) => {
                    setTeacherSearchText(e.target.value);
                    handleSearchTeacher(e.target.value);
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {teacherSearchResults.length > 0 && (
                  <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto z-10">
                    {teacherSearchResults.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelectTeacherItem(item)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {eventDetails.selectedTeacher && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="bg-gray-200 px-2 py-1 rounded flex items-center">
                    <span className="mr-2 text-sm">{eventDetails.selectedTeacher.label}</span>
                    <button onClick={removeTeacher} className="text-red-600 text-sm font-bold">
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Curso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o nome do Curso"
                  value={coursesSearchText}
                  onChange={(e) => {
                    setCoursesearchText(e.target.value);
                    handleSearchCourse(e.target.value);
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {coursesSearchResults.length > 0 && (
                  <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto z-10">
                    {coursesSearchResults.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelectCourse(item)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {eventDetails.selectedCourse && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="bg-gray-200 px-2 py-1 rounded flex items-center">
                    <span className="mr-2 text-sm">{eventDetails.selectedCourse.label}</span>
                    <button onClick={removeCourse} className="text-red-600 text-sm font-bold">
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Matéria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matéria</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o nome da Matéria"
                  value={subjectsSearchText}
                  onChange={(e) => {
                    setSubjectsearchText(e.target.value);
                    handleSearchSubject(e.target.value);
                  }}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {subjectsSearchResults.length > 0 && (
                  <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto z-10">
                    {subjectsSearchResults.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => handleSelectSubjectItem(item)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {eventDetails.selectedSubject && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="bg-gray-200 px-2 py-1 rounded flex items-center">
                    <span className="mr-2 text-sm">{eventDetails.selectedSubject.label}</span>
                    <button onClick={removeSubject} className="text-red-600 text-sm font-bold">
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Linha adicional para Data e Observações */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data do Agendamento</label>
              <input
                type="date"
                value={eventDetails.date || ""}
                onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                placeholder="Digite suas observações..."
                value={eventDetails.notes || ""}
                onChange={(e) => setEventDetails({ ...eventDetails, notes: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Linha para Horários */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Início</label>
              <input
                type="time"
                value={eventDetails.inicio}
                onChange={(e) => setEventDetails({ ...eventDetails, inicio: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Término</label>
              <input
                type="time"
                value={eventDetails.fim}
                onChange={(e) => setEventDetails({ ...eventDetails, fim: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Linha para Checkboxes de Aula Recorrente e Reposição */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={eventDetails.recorrente}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, recorrente: e.target.checked, days: [] })
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 text-sm">Aula Recorrente</span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={eventDetails.reposicao}
                onChange={(e) =>
                  setEventDetails({ ...eventDetails, reposicao: e.target.checked })
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 text-sm">Reposição</span>
            </div>
          </div>

          {eventDetails.recorrente && (
            <div className="col-span-2 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selecione os dias da semana:</p>
              <div className="grid grid-cols-7 gap-2">
                {["seg", "ter", "qua", "qui", "sex", "sab", "dom"].map((day) => (
                  <label key={day} className="flex flex-col items-center">
                    <input
                      type="checkbox"
                      checked={eventDetails.days.includes(day)}
                      onChange={() => handleToggleDay(day)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="mt-1 text-xs">{day.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Botão de Envio */}
          <div className="mt-6 text-center col-span-2">
            <button
              onClick={validateAndSaveEvent}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
            >
              {eventDetails.id ? "Alterar" : "Salvar"}
            </button>
          </div>
        </div>
      </div>

      {/* Submodal de Conflito */}
      {showConflictModal && <ConflictModal />}
    </>
  );
}
