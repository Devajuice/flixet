"use client";
import MediaGrid from "./MediaGrid";
import TVCard from "./TVCard";

/**
 * AnimeGrid — renders a grid of anime (TMDB TV objects from the anime query).
 * Anime from TMDB are TV objects so TVCard handles them correctly.
 */
export default function AnimeGrid({ animes = [] }) {
  return (
    <MediaGrid
      items={animes}
      CardComponent={TVCard}
      itemProp="show"
      emptyMessage="No anime found"
      minCardWidth="175px"
    />
  );
}
