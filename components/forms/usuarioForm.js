import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function UsuarioForm({ register, errors }) {
    return (
        <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                        id="username"
                        type="text"
                        {...register("username")}
                        placeholder="joao_silva"
                    />
                    {errors.username && (<p className="text-red-500 text-sm">*{errors.username.message}</p>)}
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="text"
                        {...register("email")}
                        placeholder="exemplo@dominio.com "
                    />
                    {errors.email && (<p className="text-red-500 text-sm">*{errors.email.message}</p>)}
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
                <div>
                    <Label htmlFor="senha">Senha</Label>
                    <Input
                        id="senha"
                        type="password"
                        {...register("senha")}
                    />
                    {errors.senha && (<p className="text-red-500 text-sm">*{errors.senha.message}</p>)}
                </div>
            </div>
        </div>
    );
}