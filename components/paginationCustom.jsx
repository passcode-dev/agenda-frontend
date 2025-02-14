"use client";

import {
    Pagination,
    PaginationContent,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function PaginationUI() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const handlePageChange = (page) => {
        const paramUrl= new URLSearchParams(searchParams.toString())
        paramUrl.set("page",page);
        router.push(`?${paramUrl.toString()}`, { scroll: false });
    };

    return (
        <Pagination>
            <PaginationContent className="flex items-center gap-2">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                </PaginationPrevious>

                {currentPage}

                <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)} 
                >
                </PaginationNext>

            </PaginationContent>
        </Pagination>
    );
}