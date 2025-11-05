import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginatedData } from "@/types";
import type { LotsFilters } from "@/types/lots";
import { buildQuery } from "@/lib/build-query";

export function DefaultPagination<T>({data, filters,}: { data: PaginatedData<T>; filters?: LotsFilters; }) {
    const currentPage = data.current_page ?? 1;
    const lastPage = data.last_page ?? 1;
    if (lastPage <= 1) return null;

    const basePath =
        data.path ??
        (typeof window !== "undefined" ? window.location.pathname : "");

    const pages: (number | "...")[] = [];
    const pageWindow = 1;

    for (let i = 1; i <= lastPage; i++) {
        const near = i >= currentPage - pageWindow && i <= currentPage + pageWindow;
        if (i === 1 || i === lastPage || near) pages.push(i);
        else if (pages[pages.length - 1] !== "...") pages.push("...");
    }

    const buildUrl = (page: number) =>
        `${basePath}${buildQuery({ ...(filters ?? {}), page })}`;

    return (
        <Pagination className="overflow-x-auto">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={data.prev_page_url ? buildUrl(currentPage - 1) : "#"}
                        isActive={!!data.prev_page_url}
                    />
                </PaginationItem>

                {pages.map((p, i) =>
                    p === "..." ? (
                        <PaginationItem key={`e-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={`p-${p}`}>
                            <PaginationLink href={buildUrl(p)} isActive={p === currentPage}>
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        href={data.next_page_url ? buildUrl(currentPage + 1) : "#"}
                        isActive={!!data.next_page_url}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
