"use client";

import SearchResults from "@/components/SearchResults";
import { Search, Film, TrendingUp } from "lucide-react";

export default function SearchPageWrapper({ query, data }) {
  return (
    <>
      <style jsx>{`
        .search-page {
          max-width: 1600px;
          margin: 0 auto;
          padding-bottom: 80px;
        }

        /* ── Header ── */
        .search-header {
          margin-bottom: 36px;
        }
        .search-eyebrow {
          font-size: 12px;
          font-weight: 700;
          color: #e50914;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 10px;
        }
        .search-title {
          font-family: "Bebas Neue", sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          letter-spacing: 0.02em;
          color: #fff;
          line-height: 1;
          margin: 0 0 12px;
        }
        .search-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .search-query-text {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 400;
        }
        .search-query-text strong {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 700;
        }
        .results-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(229, 9, 20, 0.12);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 50px;
          padding: 4px 12px;
          font-size: 12px;
          font-weight: 700;
          color: #ff6b73;
          letter-spacing: 0.02em;
        }

        /* ── Empty state ── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 45vh;
          gap: 20px;
          text-align: center;
          padding: 40px 20px;
        }
        .empty-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-title {
          font-family: "Bebas Neue", sans-serif;
          font-size: 36px;
          letter-spacing: 0.02em;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }
        .empty-text {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.4);
          max-width: 440px;
          line-height: 1.7;
          margin: 0;
        }

        /* ── Tips / suggestions card ── */
        .info-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 20px 24px;
          max-width: 440px;
          width: 100%;
          text-align: left;
        }
        .info-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .info-list li {
          padding: 9px 0 9px 18px;
          position: relative;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.45);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          line-height: 1.5;
        }
        .info-list li:last-child {
          border-bottom: none;
        }
        .info-list li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #e50914;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .search-title {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="search-page">
        {query ? (
          <>
            {/* Header */}
            <div className="search-header">
              <p className="search-eyebrow">Search</p>
              <h1 className="search-title">Results</h1>
              <div className="search-meta">
                <p className="search-query-text">
                  Showing results for <strong>"{query}"</strong>
                </p>
                {data.results.length > 0 && (
                  <span className="results-badge">
                    <Film size={12} />
                    {data.results.length}{" "}
                    {data.results.length === 1 ? "result" : "results"}
                  </span>
                )}
              </div>
            </div>

            {/* Results */}
            {data.results.length > 0 ? (
              <SearchResults movies={data.results} />
            ) : (
              <div className="empty-state">
                <div className="empty-icon-wrap">
                  <Search size={32} color="rgba(255,255,255,0.3)" />
                </div>
                <h2 className="empty-title">No Results Found</h2>
                <p className="empty-text">
                  We couldn't find anything for "{query}". Try checking your
                  spelling or using different keywords.
                </p>
                <div className="info-card">
                  <div className="info-card-title">
                    <TrendingUp size={14} color="#e50914" />
                    Search Tips
                  </div>
                  <ul className="info-list">
                    <li>Check your spelling</li>
                    <li>Try different or more general keywords</li>
                    <li>Search by title, actor, or genre</li>
                    <li>Use English titles for best results</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Search size={32} color="rgba(255,255,255,0.3)" />
            </div>
            <h2 className="empty-title">Search Flixet</h2>
            <p className="empty-text">
              Type in the search bar above to find movies, TV shows, and more.
            </p>
            <div className="info-card">
              <div className="info-card-title">
                <TrendingUp size={14} color="#e50914" />
                Popular Searches
              </div>
              <ul className="info-list">
                <li>Action movies</li>
                <li>Marvel movies</li>
                <li>Breaking Bad</li>
                <li>Horror films</li>
                <li>Sci-fi classics</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
