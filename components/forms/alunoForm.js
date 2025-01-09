import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AlunoForm({ register, errors }) {
    return (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                        id="nome"
                        type="text"
                        {...register("nome")}
                        placeholder="João da Silva"
                    />
                    {errors.nome && (<p className="text-red-500 text-sm">*{errors.nome.message}</p>)}
                </div>

                <div>
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input
                        id="dataNascimento"
                        type="date"
                        {...register("dataNascimento")}
                    />
                    {errors.dataNascimento && (<p className="text-red-500 text-sm">*{errors.dataNascimento.message}</p>)}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                        id="cpf"
                        type="text"
                        {...register("cpf")}
                        placeholder="000.000.000-00"
                    />
                    {errors.cpf && (<p className="text-red-500 text-sm">*{errors.cpf.message}</p>)}
                </div>
                <div>
                    <Label htmlFor="rg">RG</Label>
                    <Input
                        id="rg"
                        type="text"
                        {...register("rg")}
                        placeholder="00.000.000-0"
                    />
                    {errors.rg && (<p className="text-red-500 text-sm">*{errors.rg.message}</p>)}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                        id="telefone"
                        type="text"
                        {...register("telefone")}
                        placeholder="(00) 00000-0000"
                    />
                    {errors.telefone && (<p className="text-red-500 text-sm">*{errors.telefone.message}</p>)}
                </div>
            </div>
        </div>
    );
}