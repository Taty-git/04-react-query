import styles from './App.module.css';
import toast, {Toaster} from 'react-hot-toast';
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import ReactPaginate from 'react-paginate';
import {useState, useEffect} from "react";
import type {Movie} from '../../types/movie';
import {fetchMovies} from "../../services/movieService";
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import MovieGrid from '../MovieGrid/MovieGrid';
import SearchBar from '../SearchBar/SearchBar';


export default function App() {

    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [movie, setMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["movies", search, page],
        queryFn: () => fetchMovies(search, page),
        enabled: search !== "",
        placeholderData: keepPreviousData,
    });
        useEffect(() => {
        if (isSuccess && data?.results?.length === 0) {
            toast.error("No movies found.");
        }
    }, [isSuccess, data]);


    const handleSearch = (newSearch: string): void => {
        setSearch(newSearch);
        setPage(1); 
    };

    const toggleModal = (): void => {
        setIsOpen((prev) => !prev);
        if (isOpen && movie) setMovie(null);
    };

    const onSelect = (selectedMovie: Movie): void => {
        setMovie(selectedMovie);
        toggleModal();
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
                    forcePage={page - 1 >= 0 ? page - 1 : 0}
                    containerClassName={styles.pagination}
                    activeClassName={styles.active}
                    nextLabel="→"
                    previousLabel="←"
                />
            )}
                 {isOpen && movie && (<MovieModal onClose={toggleModal} movie={movie} />
                )}

                {isSuccess && data && data.results && data.results.length > 0 && (
                <MovieGrid movies={data.results} onSelect={onSelect} />
                )}
               
                {isSuccess && data && data.results && data.results.length === 0 && (
                <p>No movies found.</p> 
                )}
        </div>
    );
}