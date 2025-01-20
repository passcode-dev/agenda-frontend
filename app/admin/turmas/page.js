"use client";
import FilterModal from "@/components/Filters/FilterModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Turmas() {
    return (
        <div className="container max-w-4xl mx-auto p-6">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="mt-4 text-3xl font-bold">Turmas</h1>
                    <p className="text-muted-foreground">Lista de turmas cadastrados</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                    <Link className="flex items-center justify-center" href="/admin/usuarios/novo">
                        <Button className="px-4">Nova Turma</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}