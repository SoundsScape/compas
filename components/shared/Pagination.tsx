import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function DashboardPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) onPageChange(currentPage - 1)
                            }}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary hover:text-primary-foreground"}
                        />
                    </PaginationItem>

                    {totalPages > 1 && [...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1
                        if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === pageNumber}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            onPageChange(pageNumber)
                                        }}
                                        className={`cursor-pointer ${currentPage === pageNumber ? "bg-accent text-accent-foreground" : "hover:bg-primary hover:text-primary-foreground"}`}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        }
                        if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                        ) {
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationEllipsis className="text-white/50" />
                                </PaginationItem>
                            )
                        }
                        return null
                    })}

                    {totalPages === 1 && (
                        <PaginationItem>
                            <PaginationLink isActive className="bg-accent text-accent-foreground">1</PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) onPageChange(currentPage + 1)
                            }}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-primary hover:text-primary-foreground"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}