import css from "./Pagination.module.css";


interface PaginationProps {
    totalPages: number | undefined,
    currentPage: number,
    handlePreviousPage: () => void,
    handleNextPage: () => void,
    handlePageChange: (page: number) => void
}

export default function Pagination({ totalPages, currentPage, handlePreviousPage, handleNextPage, handlePageChange }: PaginationProps)
{
    return ( (
          <div className={css.pagination}>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={css.paginationBtn}
            >
              Previous
            </button>
            
            <div className={css.pageNumbers}>
              {Array.from({ length: totalPages ?? 0 }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${css.pageBtn} ${currentPage === page ? css.activePage : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === (totalPages ?? 0)}
              className={css.paginationBtn}
            >
              Next
            </button>
          </div>
        ))}