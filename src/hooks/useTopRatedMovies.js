import { useDispatch, useSelector } from "react-redux";
import { addTopRatedMovies } from "../utils/movieSlice";
import { useEffect, useCallback } from "react";
import { API_OPTIONS, SUPPORTED_LANGUAGES } from "../utils/constants";

const useTopRatedMovies = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const langCode =
    SUPPORTED_LANGUAGES.find((l) => l.identifier === langKey)?.tmdbCode ||
    "en-US";

  const TopRatedMovies = useSelector(
    (store) => store.movies.nowPlayingMovies
  );

  const GetTopRatedMovies = useCallback(async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?page=1&language=${langCode}`,
      API_OPTIONS
    );
    const json = await data.json();
    dispatch(addTopRatedMovies(json.results));
  }, [dispatch, langCode]);

  useEffect(() => {
    if (!TopRatedMovies) {
      GetTopRatedMovies();
    }
  }, [TopRatedMovies, GetTopRatedMovies]);
};

export default useTopRatedMovies;
