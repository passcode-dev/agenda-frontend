"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock de eventos
const mockEvents = {
    "2025-02-05T06:00": {
        turmaAluno: "Turma A",
        curso: "Matemática",
        inicio: "06:00",
        fim: "09:00",
        reposicao: false,
    },
    "2025-02-05T10:00": {
        turmaAluno: "Turma B",
        curso: "História",
        inicio: "10:30",
        fim: "11:30",
        reposicao: true,
    },
    "2025-03-08T14:00": {
        turmaAluno: "Turma C",
        curso: "Química",
        inicio: "14:00",
        fim: "15:00",
        reposicao: false,
    },
};

export default function Agenda() {
    const { toast } = useToast();
    const [date, setDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        turmaAluno: "",
        curso: "",
        inicio: "",
        fim: "",
        reposicao: false,
    });
    const [events, setEvents] = useState({});

    useEffect(() => {
        const { startOfWeek, endOfWeek } = getWeekRange();

        const fetchData = () => {
            const eventsFromApi = Object.keys(mockEvents).reduce((acc, key) => {
                const eventDate = new Date(key);
                if (eventDate >= startOfWeek && eventDate <= endOfWeek) {
                    acc[key] = mockEvents[key];
                }
                return acc;
            }, {});

            setEvents(eventsFromApi);
        };

        fetchData();
    }, [date]);

    const getWeekRange = () => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return { startOfWeek, endOfWeek };
    };

    const filteredEvents = Object.keys(events).reduce((acc, key) => {
        const eventDate = new Date(key);
        const { startOfWeek, endOfWeek } = getWeekRange();
        if (eventDate >= startOfWeek && eventDate <= endOfWeek) {
            acc[key] = events[key];
        }
        return acc;
    }, {});

    const handleSaveEvent = () => {
        if (!eventDetails.turmaAluno || !eventDetails.curso || !eventDetails.inicio || !eventDetails.fim) {
            toast({
                title: "Erro",
                description: "Preencha todos os campos!",
                variant: "destructive",
                autoClose: 3000,
            });
            return;
        }

        setEvents({ ...events, [selectedSlot]: eventDetails });
        setIsModalOpen(false);
        setEventDetails({ turmaAluno: "", curso: "", inicio: "", fim: "", reposicao: false });
        toast({
            title: "Sucesso",
            description: "Evento agendado com sucesso!",
            variant: "success",
            autoClose: 3000,
        });
    };

    const renderWeek = () => {
        const { startOfWeek } = getWeekRange();
        return Array.from({ length: 7 }, (_, i) => {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            return currentDate;
        });
    };

    const calculateEventHeight = (startTime, endTime) => {
        const startInMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
        const endInMinutes = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

        const durationInMinutes = endInMinutes - startInMinutes;

        const height = (durationInMinutes / 1440) * 24 * 64;

        return height;
    };

    const calculateEventTopPosition = (startTime) => {
        const startInMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
        const top = (startInMinutes / 1440) * 24 * 64 + 64;
        return top;
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl w-full transition-all duration-300">
            <div className="flex w-full border-gray-300">
                <div className="flex flex-col mt-16 border-gray-300">
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
                            const isToday = currentDate.toDateString() === new Date().toDateString();
                            const dayKey = currentDate.toISOString().split("T")[0];

                            return (
                                <div key={dayIndex} className="border-l border-gray-300 relative">
                                    <div
                                        className={`p-2 text-center font-semibold ${isToday ? "bg-blue-500 text-white" : "bg-gray-100"
                                            } transition-colors duration-300 sticky top-0 z-10 border-b border-gray-300`}
                                    >
                                        {"Dom Seg Ter Qua Qui Sex Sáb".split(" ")[currentDate.getDay()]} <br />
                                        {currentDate.getDate()}
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
                                                            inicio: `${String(hourIndex).padStart(2, "0")}:00`,
                                                            fim: "",
                                                            reposicao: false,
                                                        });
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="h-16 w-full border-t border-gray-300 flex justify-center items-center transition relative hover:bg-gray-200"
                                                ></button>

                                                {filteredEvents[slotKey] && (
                                                    <div
                                                        onClick={() => {
                                                            setSelectedSlot(slotKey);
                                                            setEventDetails(filteredEvents[slotKey]);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="absolute w-11/12 ml-1 bg-blue-200 p-1 rounded-md text-xs cursor-pointer transition-all duration-200 hover:bg-blue-300"
                                                        style={{
                                                            top: `${calculateEventTopPosition(filteredEvents[slotKey].inicio)}px`,
                                                            height: `${calculateEventHeight(filteredEvents[slotKey].inicio, filteredEvents[slotKey].fim)}px`,
                                                            zIndex: 1,
                                                        }}
                                                    >
                                                        <span className="text-white font-bold text-sm">{filteredEvents[slotKey].turmaAluno} - {filteredEvents[slotKey].curso}</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {isModalOpen && (
                <div
                    className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-all duration-300 opacity-100"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="bg-white p-6 rounded-lg w-96 transition-all duration-500 transform scale-100 opacity-100" onClick={(e) => e.stopPropagation()}>
                        <h2 className="font-bold text-xl mb-4">Novo Agendamento</h2>
                        <input
                            type="text"
                            placeholder="Turma ou Aluno"
                            value={eventDetails.turmaAluno}
                            onChange={(e) => setEventDetails({ ...eventDetails, turmaAluno: e.target.value })}
                            className="w-full p-3 border rounded mt-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <input
                            type="text"
                            placeholder="Curso"
                            value={eventDetails.curso}
                            onChange={(e) => setEventDetails({ ...eventDetails, curso: e.target.value })}
                            className="w-full p-3 border rounded mt-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <input
                            type="time"
                            value={eventDetails.inicio}
                            onChange={(e) => setEventDetails({ ...eventDetails, inicio: e.target.value })}
                            className="w-full p-3 border rounded mt-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <input
                            type="time"
                            value={eventDetails.fim}
                            onChange={(e) => setEventDetails({ ...eventDetails, fim: e.target.value })}
                            className="w-full p-3 border rounded mt-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={eventDetails.reposicao}
                                onChange={(e) => setEventDetails({ ...eventDetails, reposicao: e.target.checked })}
                            />
                            <span className="ml-2">Reposição</span>
                        </label>
                        <button
                            onClick={handleSaveEvent}
                            className="mt-4 p-3 bg-blue-500 text-white rounded w-full transition-all duration-300 transform hover:scale-105"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
