import {useState} from "react";
import styles from './App.module.css';
import toast, {Toaster} from 'react-hot-toast';
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import ReactPaginate from 'react-paginate';
import type {Movie} from '../../types/movie';
import {fetchMovies} from "../../services/movieService";
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import MovieGrid from '../MovieGrid/MovieGrid';
import SearchBar from '../SearchBar/SearchBar';


export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [movie, setMovie] = useState<Movie | null>(null);

    function isActive(): void {
        setIsOpen((prev) => !prev);
        if (isOpen == true && movie != null) setMovie(null);
    }
    function onSelect(params: Movie): void {
        setMovie(params);
        isActive();
    }
    const handleSearch = async (search: string): Promise<void> => {
        try {
            setIsLoading(true);
            setIsError(false);
            setMovies([]);

            const data = await fetchMovies(search);
            setMovies(data);

            if (!data || data.length === 0) {
                toast.error("No movies found.");
            }
        } catch (error) {
            setIsError(true);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const totalPages = data?.total_pages ?? 0;

        return (
            <div className={styles.app}>
                <Toaster position="top-center" reverseOrder={false} />
                <SearchBar onSubmit={handleSearch} />
                {isLoading && <Loader />}
                {isError && <ErrorMessage />}
                {isSuccess && totalPages > 1 && (

                <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                nextLabel="→"
                previousLabel="←"
                />
            )}

            {data && data?.results.length > 0 && (
                <MovieGrid movies={data?.results} onSelect={onSelect} />
            )}
            
            {isOpen && movie && <MovieModal onClose={isActive} movie={movie} />}
            </div>
  );
}