import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function TableAlunoUI({ columns, data, onEdit, onDelete }) {
    return (
        <Table className="w-full border-spacing-y-2">
            <TableHeader>
                {columns.map((column) => (
                    <TableCell key={column}
                        className="px-4 py-2 font-bold text-center align-middle"
                    >
                        {column}
                    </TableCell>
                ))}
            </TableHeader>
            <TableBody>
                {data.map((invoice, index) => (
                    <TableRow key={index}
                        className="text-center align-middle"
                    >
                        <TableCell className="font-medium px-4 py-2 align-middle">
                            {invoice.nome}
                        </TableCell>
                        <TableCell className="px-4 py-2 align-middle">
                            {invoice.email}
                        </TableCell>
                        <TableCell className="px-4 py-2 align-middle">
                            {invoice.telefone}
                        </TableCell>
                        <TableCell className="px-4 py-2 align-middle">
                            {invoice.dataNascimento}
                        </TableCell>
                        <TableCell className="flex justify-center gap-3 px-4 py-2 align-middle">
                            <Button size="sm" onClick={() => onEdit(10)}>
                                <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="sm" onClick={() => onDelete(10)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}