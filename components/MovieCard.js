"use client";
import MediaCard from "@/components/MediaCard";

export default function MovieCard({ movie }) {
  return <MediaCard item={movie} type="movie" />;
}
