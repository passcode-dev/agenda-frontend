"use client";
import { useEffect } from 'react';

import {
    Pagination,
    PaginationContent,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function PaginationUI({hasNextPage}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const handlePageChange = (page) => {
        const paramUrl= new URLSearchParams(searchParams.toString())
        paramUrl.set("page",page);
        router.push(`?${paramUrl.toString()}`, { scroll: false });
    };

    useEffect(() => {
        if (currentPage) {
            handlePageChange(currentPage);
        }
    }, [searchParams]);

    return (
        <Pagination>
            <PaginationContent className="flex items-center gap-2">
                <PaginationPrevious
                    onClick={() => currentPage !== 1 ? handlePageChange(currentPage - 1): ''}
                    disabled={currentPage === 1}
                >
                </PaginationPrevious>

                <PaginationNext
                    onClick={() => hasNextPage ? handlePageChange(currentPage + 1) : ''} 
                    disabled={!hasNextPage}
                >
                </PaginationNext>

            </PaginationContent>
        </Pagination>
    );
}