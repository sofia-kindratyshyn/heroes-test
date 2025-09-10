import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SearchField from "../SearchField/SearchField";
import css from "./HeroesList.module.css";
import { fetchHeroes, type HeroResponse } from "../../servises/heroServises";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";

export default function HeroesList() {
  const [searchedValue, setSearchedValue] = useState("");
  const [debouncedText] = useDebounce(searchedValue, 300);
  const [currentPage, setCurrentPage] = useState(1);
  
  const {  error, data } = useQuery<HeroResponse['data']>({
    queryKey: ["heroes", currentPage, debouncedText],
    queryFn: () => fetchHeroes(currentPage, debouncedText),
    placeholderData: keepPreviousData
  });

  useEffect(() => {
    const totalPages = data?.totalPages ?? 0;
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    } else if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [data?.totalPages]);

  const getHandleSearch = (value: string) => {
    setSearchedValue(value);
    setCurrentPage(1); 
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (error) return "An error has occurred: " + (error as Error).message;
  return (
    <>
      <SearchField value={searchedValue} getValue={getHandleSearch} />
      <div className={css.heroListWrapper}>
        <h2>SuperHero List</h2>
        <ul className={css.heroesList}>
          {(data?.heroes ?? []).map((hero) => (
              <li key={hero.id}>
                <div className={css.card}>
                  <img
                    className={css.avatar}
                    src={Array.isArray(hero.images) ? (hero.images[0] ?? "") : (hero.images ?? "")}
                    alt="Hero avatar"
                  />
                  <div className={css.info}>
                    <h2>{hero.nickname}</h2>
                    <p className={css.role}>{hero.real_name}</p>
                    <p className={css.status}>{hero.catch_phrase}</p>
                  </div>
                  <div className={css.actions}>
                    <Link to={`/details/${hero.id}`} className={css.btnDetails}>
                      Details
                    </Link>
                    <Link
                      to={`/edit/${hero.id}`}
                      className={css.btnEdit}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        {(data?.totalPages ?? 0) > 1 &&
          <Pagination
            totalPages={data?.totalPages}
            currentPage={currentPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            handlePageChange={handlePageChange}
          />}
      </div>
    </>
  );
}
