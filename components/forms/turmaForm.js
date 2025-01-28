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

export default function TurmaForm({ register, errors, setValue, alunos, initialValues, setAlunosMateria, alunosMateria }) {
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        if (initialValues) {
            setValue("name", initialValues.name);
            setAlunosMateria(initialValues.Students);
        }
    }, [initialValues, setValue]);

    const handleAdicionarAluno = (aluno) => {
        const alunosSelecionados = alunos.find(
            (prof) => prof.id === aluno
        );
        if (
            alunosSelecionados &&
            !alunosMateria.some((alun) => alun.id === alunosSelecionados.id)
        ) {
            setAlunosMateria((prev) => [...prev, alunosSelecionados]);
        }
        setSearchTerm(""); 
    };

   
    const filteredProfessores = searchTerm
        ? alunos.filter(aluno =>
            aluno.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : alunos;

    return (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label>Turma</Label>
                    <Input
                        type="text"
                        {...register("name")}
                    />
                    {errors.name && (<p className="text-red-500 text-sm">*{errors.name.message}</p>)}
                </div>
                <div>
                    <Label>Alunos</Label>
                    <Select onValueChange={handleAdicionarAluno}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um aluno..." />
                        </SelectTrigger>
                        <SelectContent>
                            <Input
                                type="text"
                                placeholder="Buscar aluno..."
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
                                <p className="p-2 text-gray-500">Nenhum aluno encontrado.</p>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-col flex-wrap gap-2 mt-4">
                <Label>Alunos adicionados</Label>
                <div className="flex flex-wrap gap-2">
                    {alunosMateria?.length > 0 ? (
                        alunosMateria.map((aluno) => (
                            <Badge key={aluno.id} className="flex items-center gap-2 justify-between p-2">
                                <span>{aluno.name + " " + aluno.last_name}</span>
                                <button
                                    onClick={() =>
                                        setAlunosMateria((prev) =>
                                            prev.filter((alun) => alun.id !== aluno.id)
                                        )
                                    }
                                >
                                    <X size={16} />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <p className="text-sm text-gray-800">Nenhum aluno adicionado</p>
                    )}
                </div>
            </div>
        </div>
    );
}
