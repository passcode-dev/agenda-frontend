import { z } from "zod";
import { regexNome, regexData, regexCpf, regexRg } from "@/lib/regex";

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
        .optional(),
    // .regex(regexCpf, "CPF deve estar no formato XXX.XXX.XXX-XX"),
    rg: z
        .string()
        .optional(),
    // .regex(regexRg, "RG deve estar no formato XX.XXX.XXX-X"),
    phone_number: z.string().optional(),
});

export { zodAluno };
