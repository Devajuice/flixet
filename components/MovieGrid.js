"use client";
import MediaGrid from "./MediaGrid";
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies = [] }) {
  return (
    <MediaGrid
      items={movies}
      CardComponent={MovieCard}
      itemProp="movie"
      emptyMessage="No movies found"
    />
  );
}
