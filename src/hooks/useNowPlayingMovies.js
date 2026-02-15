import { useDispatch, useSelector } from "react-redux";
import { addNowPlayingMovies } from "../utils/movieSlice";
import { useEffect, useCallback } from "react";
import { API_OPTIONS, SUPPORTED_LANGUAGES } from "../utils/constants";

const useNowPlayingMovies = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const langCode =
    SUPPORTED_LANGUAGES.find((l) => l.identifier === langKey)?.tmdbCode ||
    "en-US";

  const nowPlayingMovies = useSelector(
    (store) => store.movies.nowPlayingMovies
  );

  const GetNowPlayingMovies = useCallback(async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?page=1&language=${langCode}`,
      API_OPTIONS
    );

    const json = await data.json();
    dispatch(addNowPlayingMovies(json.results));
  }, [dispatch, langCode]); 

  useEffect(() => {
    if (!nowPlayingMovies) {
      GetNowPlayingMovies();
    }
  }, [nowPlayingMovies, GetNowPlayingMovies]); 
};

export default useNowPlayingMovies;
