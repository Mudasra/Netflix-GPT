import { useEffect, useCallback } from "react";
import { addTrailerVideo } from "../utils/movieSlice";
import { API_OPTIONS } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  
  const trailerVideo = useSelector(
    (store) => store.movies.trailerVideo
  );

  const getMovieVideos = useCallback(async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      API_OPTIONS
    );
    const json = await data.json();

    const filterData = json.results.filter((video) => video.type === "Trailer");
    const trailer = filterData.length ? filterData[0] : json.results[0];
    dispatch(addTrailerVideo(trailer));
  }, [dispatch, movieId]); 

  useEffect(() => {
    if (!trailerVideo) {
      getMovieVideos();
    }
  }, [trailerVideo, getMovieVideos]); 
};

export default useMovieTrailer;
