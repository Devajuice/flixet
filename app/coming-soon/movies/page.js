"use client";
import ComingSoonPage from "@/components/ComingSoonPage";
import MovieCard from "@/components/MovieCard";

export default function ComingSoonMoviesPage() {
  return <ComingSoonPage type="movie" CardComponent={MovieCard} />;
}
