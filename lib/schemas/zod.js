import { z } from "zod";
import { regexNome, regexData, regexCpf, regexRg, regexUsername, regexEmail, regexPassword, regexPhone, regexLastName, regexNomeProfessor } from "@/lib/regex";

const zodAluno = z.object({
    name: z.string().regex(regexNome, "O nome deve conter pelo menos dois nomes."),
    birth_date: z.string().regex(regexData, "Data de nascimento deve estar no formato YYYY-MM-DD")
        .refine((dataNascimento) => {
            const data = new Date(dataNascimento);
            const dataAtual = new Date();
            return data < dataAtual;
        }, { message: "Data de nascimento deve ser anterior a data atual." }),

    cpf: z
        .string()
        .regex(regexCpf, "CPF deve estar no formato XXX.XXX.XXX-XX")
        .optional(),
    rg: z
        .string()
        .regex(regexRg, "RG deve estar no formato 00.000.000-0")
        .optional(),
    phone_number: z
        .string()
        .regex(regexPhone, "Número de telefone deve estar no formato +55 (XX) XXXXX-XXXX"),
    entry_date: z
        .string()
        .regex(regexData, "Data de início deve estar no formato YYYY-MM-DD")
        .refine((initalDate) => {
            const data = new Date(initalDate);
            const dataAtual = new Date();
            return data < dataAtual;
        }, { message: "Data de início deve ser anterior a data atual." }),
    last_name: z.string().regex(regexLastName, "O sobrenome deve conter pelo menos dois nomes."),
    exit_date: z
        .string()
        .optional()
});

const zodCurso = z.object({
    name: z.string().min(1, "Nome do curso é obrigatório."),
});

const zodMateria = z.object({
    name: z.string().min(1, "Nome da matéria é obrigatório."),
});

const zodUsuario = z.object({
    username: z.string().regex(regexUsername, "Usuário deve ter pelo menos 3 caracteres (apenas letras, números ou _)"),
    email: z.string().regex(regexEmail, "Deve ser um e-mail válido"),

    password: z
        .string()
        .optional()
        .refine(
            (password) => !password || regexPassword.test(password),
            { message: "Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número." }
        )
});

const zodProfessor = z.object({

    name: z.string().regex(regexNomeProfessor, "O nome deve conter pelo menos dois nomes."),
    birth_date: z.string().regex(regexData, "Data de nascimento deve estar no formato YYYY-MM-DD")
        .refine((dataNascimento) => {
            const data = new Date(dataNascimento);
            const dataAtual = new Date();
            return data < dataAtual;
        }, { message: "Data de nascimento deve ser anterior a data atual." }),

    cpf: z
        .string()
        .regex(regexCpf, "CPF deve estar no formato XXX.XXX.XXX-XX"),
});

const zodClasse = z.object({
    name: z.string().min(1, "Nome da classe é obrigatório."),
});

export { zodAluno, zodProfessor, zodUsuario, zodMateria, zodCurso, zodClasse };
