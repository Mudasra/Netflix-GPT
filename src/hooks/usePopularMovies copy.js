import { useDispatch, useSelector } from "react-redux";
import { addPopularMovies } from "../utils/movieSlice";
import { useEffect, useCallback } from "react";
import { API_OPTIONS, SUPPORTED_LANGUAGES } from "../utils/constants";

const usePopularMovies = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const langCode =
    SUPPORTED_LANGUAGES.find((l) => l.identifier === langKey)?.tmdbCode ||
    "en-US";

  const PopularMovies = useSelector(
    (store) => store.movies.nowPlayingMovies
  );

  
  const GetPopularMovies = useCallback(async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/popular?page=1&language=${langCode}`,
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addPopularMovies(json.results));
  }, [dispatch, langCode]); 

  useEffect(() => {
    if (!PopularMovies) {
      GetPopularMovies();
    }
  }, [PopularMovies, GetPopularMovies]); 
};

export default usePopularMovies;
