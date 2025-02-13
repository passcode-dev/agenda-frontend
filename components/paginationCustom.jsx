"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function PaginationUI({ totalPage, onPageChange }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPage) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page); 
            router.push(`?${params.toString()}`, { scroll: false });
        }
    };


    const renderPages = () => {
        const pages = [];
        for (let i = 1; i <= totalPage; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        onClick={() => handlePageChange(i)}
                        isActive={i === currentPage}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return pages;
    };

    return (
        <Pagination>
            <PaginationContent className="flex items-center gap-2">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </PaginationPrevious>
                {renderPages()}
                <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPage}
                >
                    Próximo
                </PaginationNext>
            </PaginationContent>
        </Pagination>
    );
}