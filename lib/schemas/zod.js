import { z } from "zod";
import { regexNome, regexData, regexCpf, regexRg, regexUsername, regexEmail, regexPassword, regexPhone } from "@/lib/regex";

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
        .optional()
        .refine(
            (cpf) => !cpf || regexCpf.test(cpf),
            { message: "CPF inválido. O formato correto é 000.000.000-00." }
        ),
    rg: z
        .string()
        .optional()
        .refine(
            (rg) => !rg || regexRg.test(rg),
            { message: "RG inválido. O formato correto é 00.000.000-0." }
        ),
    phone_number: z
        .string()
        .regex(regexPhone, "Número de telefone deve estar no formato (XX) XXXXX-XXXX"),
    inital_date: z
        .string()
        .regex(regexData, "Data de início deve estar no formato YYYY-MM-DD")
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
    name: z.string().regex(regexNome, "O nome deve conter pelo menos dois nomes."),
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

export { zodAluno, zodProfessor, zodUsuario };
