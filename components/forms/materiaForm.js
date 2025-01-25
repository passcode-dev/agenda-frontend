"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function MateriaForm({ register, errors, setValue, professores, initialValues, setProfessoresMateria, professoresMateria }) {
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (initialValues) {
            setValue("name", initialValues.name);
            setProfessoresMateria(initialValues.Teachers);
        }
    }, [initialValues, setValue]);

    const handleAdicionarProfessor = (professor) => {
        const professorSelecionado = professores.find(
            (prof) => prof.id === professor
        );
        if (
            professorSelecionado &&
            !professoresMateria.some((prof) => prof.id === professorSelecionado.id)
        ) {
            setProfessoresMateria((prev) => [...prev, professorSelecionado]);
        }
        setSearchTerm(""); 
    };

   
    const filteredProfessores = searchTerm
        ? professores.filter(professor =>
            professor.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : professores;

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label>Matéria</Label>
                    <Input
                        type="text"
                        {...register("name")}
                    />
                    {errors.name && (<p className="text-red-500 text-sm">*{errors.name.message}</p>)}
                </div>
                <div>
                    <Label>Professores</Label>
                    <Select onValueChange={handleAdicionarProfessor}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um professor..." />
                        </SelectTrigger>
                        <SelectContent>
                            <Input
                                type="text"
                                placeholder="Buscar professor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-2"
                            />
                            {filteredProfessores.length > 0 ? (
                                filteredProfessores.map((professor) => (
                                    <SelectItem key={professor.id} value={professor.id}>
                                        {professor.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <p className="p-2 text-gray-500">Nenhum professor encontrado.</p>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col flex-wrap gap-2 mt-4">
                <Label>Professores adicionados</Label>
                <div className="flex flex-wrap gap-2">
                    {professoresMateria?.length > 0 ? (
                        professoresMateria.map((professor) => (
                            <Badge key={professor.id} className="flex items-center gap-2 justify-between p-2">
                                <span>{professor.name}</span>
                                <button
                                    onClick={() =>
                                        setProfessoresMateria((prev) =>
                                            prev.filter((prof) => prof.id !== professor.id)
                                        )
                                    }
                                >
                                    <X size={16} />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-gray-800">Nenhum professor adicionado</p>
                    )}
                </div>
            </div>
        </div>
    );
}
