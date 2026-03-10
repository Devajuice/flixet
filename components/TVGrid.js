"use client";
import MediaGrid from "./MediaGrid";
import TVCard from "./TVCard";

export default function TVGrid({ shows = [] }) {
  return (
    <MediaGrid
      items={shows}
      CardComponent={TVCard}
      itemProp="show"
      emptyMessage="No TV shows found"
    />
  );
}
