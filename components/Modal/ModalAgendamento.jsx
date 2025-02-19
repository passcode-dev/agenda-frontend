"use client";

import { useState } from "react";
import AgendaService from "@/lib/service/agendaService";

export default function ModalAgendamento({
  isModalOpen,
  onClose,
  selectedType,
  setSelectedType,
  eventDetails,
  setEventDetails,
  handleSaveEvent,
  handleToggleDay,
}) {
  // Estado para busca de Aluno/Turma
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // Estado para busca de Professor
  const [teacherSearchText, setTeacherSearchText] = useState("");
  const [teacherSearchResults, setTeacherSearchResults] = useState([]);

  // Busca para Aluno/Turma
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
        const classes = await agendaService.getClassesByName(nome);
        const mapped = (classes ?? []).map((c) => ({
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

  // Busca para Professor
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

  // Seleciona item para Aluno/Turma
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

  // Remove item selecionado (Aluno/Turma)
  const removeItem = (id) => {
    setEventDetails({
      ...eventDetails,
      selectedItems: (eventDetails.selectedItems ?? []).filter((i) => i.id !== id),
    });
  };

  // Seleciona Professor
  const handleSelectTeacher = (item) => {
    setEventDetails({ ...eventDetails, selectedTeacher: item });
    setTeacherSearchText("");
    setTeacherSearchResults([]);
  };

  // Remove o professor selecionado
  const removeTeacher = () => {
    setEventDetails({ ...eventDetails, selectedTeacher: null });
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg w-96 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Novo Agendamento</h2>

        {/* Seção de seleção de Aluno/Turma */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Tipo de Usuário:</p>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedType === "aluno"}
                onChange={() => {
                  setSelectedType("aluno");
                  setEventDetails({ ...eventDetails, selectedItems: [] });
                }}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Aluno</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedType === "turma"}
                onChange={() => {
                  setSelectedType("turma");
                  setEventDetails({ ...eventDetails, selectedItems: [] });
                }}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Turma</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
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
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div
                  key={item.id}
                  className="bg-gray-200 px-2 py-1 rounded flex items-center"
                >
                  <span className="mr-2 text-sm">{item.label}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 text-sm font-bold"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção de seleção de Professor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professor
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Digite o nome do Professor"
              value={teacherSearchText}
              onChange={(e) => {
                setTeacherSearchText(e.target.value);
                handleSearchTeacher(e.target.value);
              }}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {teacherSearchResults.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto z-10">
                {teacherSearchResults.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelectTeacher(item)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {eventDetails.selectedTeacher && (
            <div className="flex items-center bg-gray-200 px-2 py-1 rounded mt-2">
              <span className="mr-2 text-sm">{eventDetails.selectedTeacher.label}</span>
              <button onClick={removeTeacher} className="text-red-600 text-sm font-bold">
                X
              </button>
            </div>
          )}
        </div>

        {/* Campo para Curso */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Curso
          </label>
          <input
            type="text"
            placeholder="Digite o nome do Curso"
            value={eventDetails.curso}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, curso: e.target.value })
            }
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Horários */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário de Início
          </label>
          <input
            type="time"
            value={eventDetails.inicio}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, inicio: e.target.value })
            }
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário de Término
          </label>
          <input
            type="time"
            value={eventDetails.fim}
            onChange={(e) =>
              setEventDetails({ ...eventDetails, fim: e.target.value })
            }
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Checkbox de Reposição */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={eventDetails.reposicao}
              onChange={(e) =>
                setEventDetails({ ...eventDetails, reposicao: e.target.checked })
              }
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Reposição</span>
          </label>
        </div>

        {/* Checkbox de Aula Recorrente */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={eventDetails.recorrente}
              onChange={(e) =>
                setEventDetails({
                  ...eventDetails,
                  recorrente: e.target.checked,
                  days: [],
                })
              }
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Aula Recorrente</span>
          </label>
        </div>

        {eventDetails.recorrente && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Selecione os dias da semana:</p>
            <div className="flex justify-between">
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

        <button
          onClick={handleSaveEvent}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
