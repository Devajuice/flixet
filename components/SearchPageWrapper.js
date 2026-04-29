"use client";

import SearchResults from "@/components/SearchResults";
import { Search, Film, TrendingUp } from "lucide-react";

export default function SearchPageWrapper({ query, data }) {
  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 var(--container-padding)",
        paddingBottom: 80,
      }}
    >
      {query ? (
        <>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: "var(--font-bold)",
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              Search Results
            </p>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: "var(--font-extrabold)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: "var(--text-primary)",
                margin: "0 0 12px",
              }}
            >
              Results
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-tertiary)",
                  margin: 0,
                }}
              >
                Showing results for{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  "{query}"
                </strong>
              </p>
              {data.results.length > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(229,9,20,0.1)",
                    border: "1px solid rgba(229,9,20,0.25)",
                    borderRadius: "50px",
                    padding: "4px 12px",
                    fontSize: 11,
                    fontWeight: "var(--font-bold)",
                    color: "var(--accent)",
                  }}
                >
                  <Film size={11} />
                  {data.results.length}{" "}
                  {data.results.length === 1 ? "result" : "results"}
                </span>
              )}
            </div>
          </div>

          {data.results.length > 0 ? (
            <SearchResults movies={data.results} />
          ) : (
            <div style={{ textAlign: "center", padding: "64px 20px 80px" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-full)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Search size={32} color="var(--text-muted)" />
              </div>
              <h2
                style={{
                  fontSize: "var(--text-2xl)",
                  fontWeight: "var(--font-bold)",
                  marginBottom: 12,
                }}
              >
                No Results Found
              </h2>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-tertiary)",
                  maxWidth: 440,
                  margin: "0 auto 24px",
                  lineHeight: 1.7,
                }}
              >
                We couldn't find anything for "{query}". Try checking your
                spelling or using different keywords.
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "18px 22px",
                  maxWidth: 400,
                  margin: "0 auto",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "var(--text-xs)",
                    fontWeight: "var(--font-bold)",
                    color: "var(--text-secondary)",
                    marginBottom: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  <TrendingUp size={13} color="var(--accent)" /> Search Tips
                </div>
                {[
                  "Check your spelling",
                  "Try different or more general keywords",
                  "Search by title, actor, or genre",
                  "Use English titles for best results",
                ].map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "8px 0 8px 16px",
                      position: "relative",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-tertiary)",
                      borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: "var(--accent)",
                      }}
                    >
                      →
                    </span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "64px 20px 80px" }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Search size={32} color="var(--text-muted)" />
          </div>
          <h2
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: "var(--font-bold)",
              marginBottom: 12,
            }}
          >
            Search Flixet
          </h2>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-tertiary)",
              maxWidth: 440,
              margin: "0 auto 24px",
              lineHeight: 1.7,
            }}
          >
            Type in the search bar above to find movies, TV shows, and more.
          </p>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: "18px 22px",
              maxWidth: 400,
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "var(--text-xs)",
                fontWeight: "var(--font-bold)",
                color: "var(--text-secondary)",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              <TrendingUp size={13} color="var(--accent)" /> Popular Searches
            </div>
            {[
              "Action movies",
              "Marvel movies",
              "Breaking Bad",
              "Horror films",
              "Sci-fi classics",
            ].map((tip, i, arr) => (
              <div
                key={i}
                style={{
                  padding: "8px 0 8px 16px",
                  position: "relative",
                  fontSize: "var(--text-sm)",
                  color: "var(--text-tertiary)",
                  borderBottom:
                    i < arr.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--accent)",
                  }}
                >
                  →
                </span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
