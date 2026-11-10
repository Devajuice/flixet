import MovieDetailsClient from "./MovieDetailsClient";
import { getMovieDetails } from "@/lib/tmdb";

const IMG = "https://image.tmdb.org/t/p";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    const title = movie?.title ? `${movie.title} - Flixet` : "Movie - Flixet";
    const description =
      movie?.overview?.slice(0, 160)?.trim() ||
      `Watch ${movie?.title || "this movie"} on Flixet.`;
    const image = movie?.backdrop_path
      ? `${IMG}/w1280${movie.backdrop_path}`
      : movie?.poster_path
        ? `${IMG}/w500${movie.poster_path}`
        : "/og-image.png";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "video.movie",
        images: [{ url: image, alt: movie?.title || "Movie" }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Movie - Flixet",
      description: "Watch movies on Flixet.",
    };
  }
}

export default async function MoviePage({ params }) {
  return <MovieDetailsClient params={params} />;
}
