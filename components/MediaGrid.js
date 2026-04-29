"use client";

/**
 * MediaGrid — shared grid for movies, TV shows, and anime.
 *
 * Props:
 *   items        — array of TMDB objects
 *   CardComponent — MovieCard | TVCard | any card component
 *   itemProp     — prop name to pass each item as, e.g. "movie" | "show" | "anime"
 *   emptyMessage — optional custom empty string
 *   minCardWidth — optional override, default "185px"
 */
export default function MediaGrid({
  items = [],
  CardComponent,
  itemProp = "item",
  emptyMessage,
  minCardWidth = "185px",
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return <div style={styles.empty}>{emptyMessage || "No results found"}</div>;
  }

  return (
    <>
      <style jsx>{`
        .media-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(${minCardWidth}, 1fr)
          );
          gap: 20px;
          margin-bottom: 60px;
          padding: 0 4px;
        }

        @media (min-width: 1024px) {
          .media-grid {
            gap: 24px;
            padding: 0 8px;
          }
        }

        @media (max-width: 768px) {
          .media-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding: 0 2px;
          }
        }

        @media (max-width: 480px) {
          .media-grid {
            gap: 10px;
            padding: 0;
          }
        }
      `}</style>

      <div className="media-grid">
        {items.map((item) => (
          <CardComponent key={item.id} {...{ [itemProp]: item }} />
        ))}
      </div>
    </>
  );
}

const styles = {
  empty: {
    textAlign: "center",
    padding: "40px",
    color: "var(--text-secondary)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
  },
};
