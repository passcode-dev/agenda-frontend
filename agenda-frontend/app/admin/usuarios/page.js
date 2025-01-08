"use client";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import TableUsuarioUI from '@/components/tables/tableUsuario';
import Back from '@/components/back';
import { useEffect, useRef, useState } from 'react';
import UsuarioService from '@/lib/service/usuarioService';
import { Input } from '@/components/ui/input';
import { SelectUI } from '@/components/selectCustom';
import { useToast } from '@/hooks/use-toast';


export default function Usuarios() {
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [selected, setSelected] = useState("");
    const filtro = useRef("");
    const { toast } = useToast();
    const columns = ["Usuário", "Email", "Ações"];
    const data = [
        {
            usuario: "João",
            email: "w@w.com",
        },
        {
            usuario: "Maria",
            email: "w@w.com",
        },
        {
            usuario: "José",
            email: "w@w.com",
        },
    ];

    const fetchUsuarios = async () => {
        setLoading(true);
        const usuarioService = new UsuarioService();
        const usuarios = await usuarioService.usuarios();
        if (usuarios.length > 0) {
            setLoading(false);
            return setUsuarios(usuarios);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const editarUsuario = (id) => {
        router.push(`/admin/alunos/editar/${id}`);
    }

    const deletarUsuario = (id) => {
        const confirm = window.confirm("Deseja realmente deletar este aluno?");
        if (!confirm) {
            return;
        }
    }

    const valorSelect = (value) => {
        setSelected(value);
    };

    const filtroUsuarios = async () => {
        console.log(filtro.current.value);
        console.log(selected);
        if (!filtro.current.value && selected == "") {
            console.log("Fecth all");
        }

        if (filtro.current.value && selected == "") {
            return toast({
                title: "Selecione um filtro",
                description: "Selecione um filtro para pesquisar",
            })
        }

        if (!filtro.current.value && selected != "") {
            return toast({
                title: "Digite um valor",
                description: "Digite um valor para pesquisar",
            })


        }
    }

    return (
        <div className="container max-w-4xl justify-center items-center mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Back icon={<ArrowLeft className="h-4 w-4" />} text="Voltar" href="/admin" />
                </div>
            </div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">
                        Usuários
                    </h1>
                    <p className="text-muted-foreground">
                        Lista de usuários cadastrados
                    </p>
                </div>
                <div>
                    <Link href="/admin/usuarios/novo">
                        <Button className="px-4 py-2 rounded mt-4">
                            Novo Usuário
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="mt-4">
                <div className='mb-4'>
                    <h2 className="text-xl font-bold">Filtros</h2>
                </div>
                <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 items-end mb-6'>
                    <div>
                        <Input
                            type="text"
                            placeholder="Pesquisar..."
                            ref={filtro}
                        />
                    </div>
                    <div>
                        <SelectUI placeholder="Filtrar por..." items={["Usuário", "Email"]} onValueChange={valorSelect} />
                    </div>
                    <div className="flex justify-start sm:justify-end">
                        <Button onClick={filtroUsuarios} >
                            Pesquisar
                        </Button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner message="Carregando..." />
                    </div>
                ) : (
                    data.length > 0 ? (
                        <TableUsuarioUI columns={columns} data={data} onEdit={editarUsuario} onDelete={deletarUsuario} />
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <p>Nenhum aluno cadastrado.</p>
                        </div>
                    )
                )}

            </div>
        </div >
    );
}