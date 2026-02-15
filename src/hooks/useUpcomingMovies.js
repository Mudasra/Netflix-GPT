import { useDispatch, useSelector } from "react-redux";
import { addUpcomingMovies } from "../utils/movieSlice";
import { useEffect, useCallback } from "react";
import { API_OPTIONS, SUPPORTED_LANGUAGES } from "../utils/constants";

const useUpcomingMovies = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const langCode =
    SUPPORTED_LANGUAGES.find((l) => l.identifier === langKey)?.tmdbCode ||
    "en-US";

  const UpcomingMovies = useSelector(
    (store) => store.movies.nowPlayingMovies
  );

  const GetUpcomingMovies = useCallback(async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?page=1&language=${langCode}`,
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addUpcomingMovies(json.results));
  }, [dispatch, langCode]);

  useEffect(() => {
    if (!UpcomingMovies) {
      GetUpcomingMovies();
    }
  }, [UpcomingMovies, GetUpcomingMovies]);
};

export default useUpcomingMovies;
