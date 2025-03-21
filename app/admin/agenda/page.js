"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ModalAgendamento from "@/components/Modal/ModalAgendamento";
import AgendaService from "@/lib/service/agendaService";
import { Trash,Pencil  } from "lucide-react";
import Swal from 'sweetalert2';

// Função auxiliar para renderizar os detalhes do evento
const renderEventDetails = (entry, isShortEvent) => {
  const participantLabel = entry.class && entry.class.id !== 0 ? "Turma" : "Aluno";
  const participantName =
    entry.class && entry.class.id !== 0
      ? entry.class.name
      : entry.student
      ? `${entry.student.name} ${entry.student.last_name}`
      : "";

  return (
    <div className={`text-white ${isShortEvent ? 'text-[0.67rem] leading-none' : 'text-xs leading-tight'}`}>
      <div>
        <span className="font-bold">Professor: </span>
        {entry.teacher && entry.teacher.name}
      </div>
      <div>
        <span className="font-bold">{participantLabel}: </span>
        {participantName}
      </div>
      <div>
            <span className="font-bold">Matéria: </span>
            {entry.subject && entry.subject.name}
          </div>
          <div>
            <span className="font-bold">Curso: </span>
            {entry.course && entry.course.name}
          </div>

    </div>
  );
};





const getEventDurationInMinutes = (startStr, endStr) => {
  const [startHour, startMin] = startStr.split(':').map(Number);
  const [endHour, endMin] = endStr.split(':').map(Number);
  return (endHour * 60 + endMin) - (startHour * 60 + startMin); // ✅ Correto: 60 minutos por hora
};



// Função para definir a classe do balão
const getBalloonClass = (entry, defaultClass) => {
  if (entry.is_makeup_class) {
    return "bg-gradient-to-r from-pink-500 to-red-500 shadow-lg";
  }
  return defaultClass;
};

// Função no componente



export default function Agenda() {
  const { toast } = useToast();
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    turmaAluno: "",
    curso: "",
    professor: "",
    inicio: "",
    fim: "",
    reposicao: false,
    recorrente: false,
    days: [],
    notes: "",
  });
  // "events" será um objeto com chave slotKey e valor um array de diary entries
  const [events, setEvents] = useState({});
  const [selectedType, setSelectedType] = useState("aluno");
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [refreshDiary, setRefreshDiary] = useState(false);

  // Busca das salas via AgendaService
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const agendaService = new AgendaService();
        const rooms = await agendaService.getClassroom();
        if (rooms && rooms.length > 0) {
          setClassrooms(rooms);
          setSelectedClassroom(rooms[0]); // Define o primeiro como padrão
        } else {
          setClassrooms([]);
          setSelectedClassroom(null);
        }
      } catch (error) {
        console.error("Erro na requisição de salas:", error);
      }
    };
    fetchClassrooms();
  }, []);

  // Atualiza o classroom_id em eventDetails com base no selectedClassroom
  useEffect(() => {
    if (selectedClassroom && selectedClassroom.id) {
      setEventDetails((prev) => ({ ...prev, classroom_id: selectedClassroom.id }));
    }
  }, [selectedClassroom, setEventDetails]);

  const getWeekRange = () => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
  };

  // Busca os registros de diário conforme a semana e a sala selecionada
  useEffect(() => {
    const { startOfWeek, endOfWeek } = getWeekRange();
    const fetchDiary = async () => {
      try {
        const agendaService = new AgendaService();
        const jsonData = await agendaService.getDiary(
          startOfWeek.toISOString(),
          endOfWeek.toISOString(),
          selectedClassroom.id
        );
        if (jsonData.status === "success") {
          const diaryEntries = jsonData.data;
          const diaryEventsBySlot = diaryEntries.reduce((acc, entry) => {
            if (!entry.is_recurring && entry.start_time) {
              const dt = new Date(entry.start_time);
              const dayKey = dt.toISOString().split("T")[0];
              const hour = dt.getHours();
              const slotKey = `${dayKey}T${String(hour).padStart(2, "0")}:00`;
              if (!acc[slotKey]) acc[slotKey] = [];
              acc[slotKey].push(entry);
            } else if (entry.is_recurring && entry.recurrence_pattern) {
              const [dayCode, timeRange] = entry.recurrence_pattern.split("@");
              const startTime = timeRange.split("-")[0];
              const dayIndexMap = { MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 0 };
              const dayIndex = dayIndexMap[dayCode] ?? 0;
              const recurrenceDate = new Date(startOfWeek);
              recurrenceDate.setDate(startOfWeek.getDate() + ((dayIndex - startOfWeek.getDay() + 7) % 7));
              const dayKey = recurrenceDate.toISOString().split("T")[0];
              if (entry.start_time) {
                const recurringStartDate = new Date(entry.start_time).toISOString().split("T")[0];
                if (dayKey < recurringStartDate) {
                  return acc;
                }
              }
              const slotKey = `${dayKey}T${startTime}:00`.slice(0, 16);
              if (!acc[slotKey]) acc[slotKey] = [];
              acc[slotKey].push(entry);
            }
            return acc;
          }, {});
          setEvents(diaryEventsBySlot);
        } else {
          console.error("Erro ao buscar diary:", jsonData.message);
        }
      } catch (error) {
        console.error("Erro ao buscar diary:", error);
      }
    };

    fetchDiary();
  }, [date, refreshDiary, selectedClassroom]);

  const filteredEvents = events;

  const calculateEventHeight = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startInMinutes = startHour * 60 + startMin;
    const endInMinutes = endHour * 60 + endMin;
    const durationInMinutes = endInMinutes - startInMinutes;
    return (durationInMinutes / 1440) * 24 * 64;
  };

  const calculateEventTopPosition = (startTime) => {
    const [hour, min] = startTime.split(":").map(Number);
    const startInMinutes = hour * 60 + min;
    return (startInMinutes / 1440) * 24 * 64 + 64;
  };

  const renderWeek = () => {
    const { startOfWeek } = getWeekRange();
    return Array.from({ length: 7 }, (_, i) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      return currentDate;
    });
  };

  const handleToggleDay = (day) => {
    let days = eventDetails.days || [];
    if (days.includes(day)) {
      days = days.filter((d) => d !== day);
    } else {
      days.push(day);
    }
    setEventDetails({ ...eventDetails, days });
  };

  // Ao clicar num evento, transforma o registro para o formato esperado no modal
  const handleEventClick = (slotKey, entry) => {
    const dtStart = entry.start_time ? new Date(entry.start_time) : null;
    const dtEnd = entry.end_time ? new Date(entry.end_time) : null;
  
    const isTurma = entry.class && entry.class.id !== 0;
    setSelectedType(isTurma ? "turma" : "aluno"); // Aqui está a correção
    
    const transformed = {
      id: entry.id,
      classroom_id: entry.classroom_id,
      turmaAluno: isTurma 
        ? (entry.class ? entry.class.name : "") 
        : (entry.student ? `${entry.student.name} ${entry.student.last_name}` : ""),
      curso: entry.course ? entry.course.name : "",
      professor: entry.teacher ? entry.teacher.name : "",
      inicio: dtStart
        ? `${String(dtStart.getHours()).padStart(2, "0")}:${String(dtStart.getMinutes()).padStart(2, "0")}`
        : entry.recurrence_pattern
        ? entry.recurrence_pattern.split("@")[1].split("-")[0]
        : "",
      fim: dtEnd
        ? `${String(dtEnd.getHours()).padStart(2, "0")}:${String(dtEnd.getMinutes()).padStart(2, "0")}`
        : entry.recurrence_pattern
        ? entry.recurrence_pattern.split("@")[1].split("-")[1]
        : "",
      reposicao: entry.is_makeup_class,
      recorrente: entry.is_recurring,
      days: [],
      notes: entry.notes || "",
      selectedItems: isTurma 
        ? (entry.class ? [{ ...entry.class, label: entry.class.name }] : [])
        : (entry.student ? [{ ...entry.student, label: `${entry.student.name} ${entry.student.last_name}` }] : []),
      selectedTeacher: entry.teacher ? { ...entry.teacher, label: entry.teacher.name } : null,
      selectedCourse: entry.course ? { ...entry.course, label: entry.course.name } : null,
      selectedSubject: entry.subject ? { ...entry.subject, label: entry.subject.name } : null,
      date: entry.start_time ? entry.start_time.split("T")[0] : "",
    };
    
    setSelectedSlot(slotKey);
    setEventDetails(transformed);
    setIsModalOpen(true);
  };
  
  

  // Callback para forçar refresh do diary após salvar/alterar
  const onDiaryUpdatedCallback = () => {
    setRefreshDiary((prev) => !prev);
  };

  const handleDeleteEvent = async (entryId) => {
    const confirmation = await Swal.fire({
      title: 'Confirmar exclusão?',
      text: 'Deseja realmente excluir este agendamento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });
  
    if (confirmation.isConfirmed) {
      try {
        const agendaService = new AgendaService();
        const result = await agendaService.deleteDiary(entryId);
  
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: result.message || 'Agendamento excluído com sucesso.',
        });
  
        // Força o refresh do diário após exclusão
        setRefreshDiary(prev => !prev);
  
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.message || 'Falha ao excluir o agendamento.',
        });
      }
    }
  }


  const handleViewEventDetails = (entry, startStr, endStr) => {
    Swal.fire({
      title: 'Detalhes do Agendamento',
      html: `
        <div style="text-align:left;">
          <b>Sala:</b> ${entry.classroom?.name || '-'}<br/>
          <b>Professor:</b> ${entry.teacher?.name || '-'}<br/>
          ${entry.class && entry.class.id !== 0 
            ? `<b>Turma:</b> ${entry.class.name}`
            : entry.student ? `<b>Aluno:</b> ${entry.student.name} ${entry.student.last_name}` : ''}
        <br>
        <b>Matéria:</b> ${entry.subject?.name || ''}<br>
        <b>Curso:</b> ${entry.course?.name || ''}<br>
        ${entry.is_makeup_class ? '<b>Aula de Reposição</b><br>' : ''}
        ${entry.notes ? `<i>Obs:</i> ${entry.notes}<br>` : ''}
        <b>Horário:</b> ${startStr} - ${endStr}
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Fechar'
    });
  };
  

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl w-full transition-all duration-300 relative">
      {/* Legenda dos Balões */}


      {/* Select de Salas */}
      <div className="absolute top-4 right-4">
        <select
          value={selectedClassroom ? selectedClassroom.id : ""}
          onChange={(e) => {
            const selected = classrooms.find((c) => c.id === parseInt(e.target.value));
            setSelectedClassroom(selected);
          }}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </option>
          ))}
        </select>
      </div>
      <div className="absolute top-4 left-4 flex flex-col gap-1 bg-white bg-opacity-90  p-3 rounded-md text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"></div>
          <span>Aulas Normais</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500"></div>
          <span>Aulas de Reposição</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500"></div>
          <span>Aulas Recorrentes</span>
        </div>
      </div>

      {/* Calendário */}
      <div className="flex w-full border-gray-300">
        <div className="flex flex-col mt-32 border-gray-300">
          {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`).map((hour, index) => (
            <div key={index} className="flex items-start justify-center h-16 w-20 text-sm text-gray-500">
              {hour}
            </div>
          ))}
        </div>
        <div className="w-full">
          <div className="flex items-center justify-center w-full mb-4 px-4 transition-transform duration-500">
            <button
              onClick={() => setDate(new Date(date.setDate(date.getDate() - 7)))}
              className="p-3 mx-5 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              <ChevronLeft />
            </button>
            <span className="text-lg font-semibold">
              {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
            </span>
            <button
              onClick={() => setDate(new Date(date.setDate(date.getDate() + 7)))}
              className="p-3 mx-5 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              <ChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-7 border-t border-r flex-grow relative">
            {renderWeek().map((currentDate, dayIndex) => {
              const dayKey = currentDate.toISOString().split("T")[0];
              return (
                <div key={dayIndex} className="border-l border-gray-300 relative">
                  <div
                    className={`p-2 text-center font-semibold ${
                      currentDate.toDateString() === new Date().toDateString()
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    } transition-colors duration-300 sticky top-0 z-10 border-b border-gray-300`}
                  >
                    {"Dom Seg Ter Qua Qui Sex Sáb".split(" ")[currentDate.getDay()]} <br /> {currentDate.getDate()}
                  </div>
                  {Array.from({ length: 24 }, (_, hourIndex) => {
                    const slotKey = `${dayKey}T${String(hourIndex).padStart(2, "0")}:00`;
                    return (
                      <div key={hourIndex} className="transition-all duration-300">
                        <button
                          onClick={() => {
                            setSelectedSlot(slotKey);
                            setEventDetails({
                              turmaAluno: "",
                              curso: "",
                              professor: "",
                              inicio: `${String(hourIndex).padStart(2, "0")}:00`,
                              fim: "",
                              reposicao: false,
                              recorrente: false,
                              days: [],
                              notes: "",
                              date: dayKey,
                            });
                            setIsModalOpen(true);
                          }}
                          className="h-16 w-full border-t border-gray-300 flex justify-center items-center transition relative hover:bg-gray-200"
                        ></button>
                        {filteredEvents[slotKey] &&
                          filteredEvents[slotKey].map((entry) => {
                            if (!entry.is_recurring && entry.start_time && entry.end_time) {
                              const dtStart = new Date(entry.start_time);
                              const dtEnd = new Date(entry.end_time);
                              const startStr = `${String(dtStart.getHours()).padStart(2, "0")}:${String(dtStart.getMinutes()).padStart(2, "0")}`;
                              const endStr = `${String(dtEnd.getHours()).padStart(2, "0")}:${String(dtEnd.getMinutes()).padStart(2, "0")}`;
                              const durationMinutes = getEventDurationInMinutes(startStr, endStr);
                              const isShortEvent = durationMinutes <= 70; // menos ou igual a 1 hora
                              const balloonClass = getBalloonClass(entry, "bg-gradient-to-r from-indigo-500 to-blue-500 shadow-lg");
                              return (
                                  <div
                                    key={entry.id}
                                    onClick={() => handleViewEventDetails(entry, startStr, endStr)}
                                    className={`absolute w-11/12 ml-1 ${balloonClass} p-2 rounded-md cursor-pointer transition-all duration-200`}
                                    style={{
                                      top: `${calculateEventTopPosition(startStr)}px`,
                                      height: `${calculateEventHeight(startStr, endStr)}px`,
                                      zIndex: 1,
                                    }}
                                  >

                                  {/* Ícones editar/excluir 
                                  <Pencil
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEventClick(slotKey, entry);
                                    }}
                                    className="absolute top-1 right-5 w-4 h-4 text-white hover:text-yellow-200 transition z-20"
                                  />*/}

                                  <Trash
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteEvent(entry.id);
                                    }}
                                    className="absolute top-1 right-1 w-4 h-4 text-white hover:text-red-200 transition z-20"
                                  />

                                  {/* Detalhes resumidos */}
                                  {renderEventDetails(entry, isShortEvent)}
                                </div>

                              );
                            }
                            if (entry.is_recurring && entry.recurrence_pattern) {
                              const [dayCode, timeRange] = entry.recurrence_pattern.split("@");
                              const [startStr, endStr] = timeRange.split("-");
                              const durationMinutes = getEventDurationInMinutes(startStr, endStr);
                              const isShortEvent = durationMinutes <= 70; // menos ou igual a 1 hora
                              const balloonClass = getBalloonClass(entry, "bg-gradient-to-r from-green-500 to-teal-500 shadow-lg");
                              return (
                                  <div
                                    key={entry.id}
                                    onClick={() => handleViewEventDetails(entry, startStr, endStr)}
                                    className={`absolute w-11/12 ml-1 ${balloonClass} p-2 rounded-md cursor-pointer transition-all duration-200`}
                                    style={{
                                      top: `${calculateEventTopPosition(startStr)}px`,
                                      height: `${calculateEventHeight(startStr, endStr)}px`,
                                      zIndex: 1,
                                    }}
                                  >

                                    {/* Ícones editar/excluir */}
                                    <Pencil
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEventClick(slotKey, entry);
                                      }}
                                      className="absolute top-1 right-5 w-4 h-4 text-white hover:text-yellow-200 transition z-20"
                                    />

                                    <Trash
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteEvent(entry.id);
                                      }}
                                      className="absolute top-1 right-1 w-4 h-4 text-white hover:text-red-200 transition z-20"
                                    />

                                    {/* Detalhes resumidos */}
                                    {renderEventDetails(entry, isShortEvent)}
                                  </div>


                              );
                            }
                            return null;
                          })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal de Agendamento */}
      <ModalAgendamento
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        eventDetails={eventDetails}
        setEventDetails={setEventDetails}
        handleToggleDay={handleToggleDay}
        selectedClassroom={selectedClassroom}
        onDiaryUpdated={() => setRefreshDiary((prev) => !prev)}
      />
    </div>
  );
}
