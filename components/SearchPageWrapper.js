'use client';

import SearchResults from '@/components/SearchResults';
import { Search, Film, TrendingUp } from 'lucide-react';

export default function SearchPageWrapper({ query, data }) {
  return (
    <>
      <style jsx>{`
        * {
          font-family: 'DM Sans', sans-serif;
        }

        .search-container {
          padding: 40px 20px 100px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── Header ──────────────────────────────────── */
        .search-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .search-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 42px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
          margin: 0 0 12px;
        }

        .search-title span {
          color: #ffc13c;
        }

        .search-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.4);
          margin: 0 0 16px;
          letter-spacing: 0.01em;
        }

        .search-query {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }

        .results-count {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 193, 60, 0.08);
          border: 1px solid rgba(255, 193, 60, 0.22);
          border-radius: 50px;
          padding: 6px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #ffc13c;
          letter-spacing: 0.02em;
        }

        /* ── Empty / no-results state ────────────────── */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 16px;
          text-align: center;
        }

        .empty-icon {
          opacity: 0.18;
        }

        .empty-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.88);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .empty-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.38);
          max-width: 480px;
          line-height: 1.7;
          margin: 0;
        }

        /* ── Suggestions box ─────────────────────────── */
        .suggestions-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 22px 24px;
          margin-top: 16px;
          backdrop-filter: blur(10px);
          max-width: 520px;
          width: 100%;
        }

        .suggestions-title {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 14px;
          letter-spacing: 0.01em;
        }

        .suggestions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .suggestions-list li {
          padding: 9px 0 9px 22px;
          position: relative;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.5;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          letter-spacing: 0.01em;
        }

        .suggestions-list li:last-child {
          border-bottom: none;
        }

        .suggestions-list li:before {
          content: '→';
          position: absolute;
          left: 0;
          color: #ffc13c;
          font-weight: 700;
        }

        /* ── No results tip box ──────────────────────── */
        .no-results-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-left: 3px solid #ffc13c;
          border-radius: 12px;
          padding: 22px 24px;
          margin-top: 16px;
          max-width: 520px;
          width: 100%;
        }

        .no-results-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #ffc13c;
          margin: 0 0 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── Responsive ──────────────────────────────── */
        @media (max-width: 768px) {
          .search-container {
            padding: 28px 15px 80px;
          }
          .search-title {
            font-size: 26px;
            gap: 10px;
          }
          .search-subtitle {
            font-size: 14px;
          }
          .empty-title {
            font-size: 22px;
          }
          .empty-text {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="search-container">
        {query ? (
          <>
            <div className="search-header">
              <h1 className="search-title">
                <Search size={32} color="#ffc13c" />
                Search <span>Results</span>
              </h1>
              <p className="search-subtitle">
                Showing results for:{' '}
                <span className="search-query">"{query}"</span>
              </p>
              {data.results.length > 0 && (
                <div className="results-count">
                  <Film size={13} />
                  {data.results.length}{' '}
                  {data.results.length === 1 ? 'result' : 'results'} found
                </div>
              )}
            </div>

            {data.results.length > 0 ? (
              <SearchResults movies={data.results} />
            ) : (
              <div className="empty-state">
                <Search
                  size={72}
                  className="empty-icon"
                  color="rgba(255,255,255,0.6)"
                />
                <h2 className="empty-title">No results found</h2>
                <p className="empty-text">
                  We couldn't find anything matching "{query}". Try adjusting
                  your search below.
                </p>
                <div className="no-results-box">
                  <h3 className="no-results-title">Search Tips</h3>
                  <ul className="suggestions-list">
                    <li>Check your spelling</li>
                    <li>Try different keywords</li>
                    <li>Use more general terms</li>
                    <li>Search by title, actor, or genre</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Search
              size={72}
              className="empty-icon"
              color="rgba(255,255,255,0.6)"
            />
            <h2 className="empty-title">Start Your Search</h2>
            <p className="empty-text">
              Enter a movie title, actor name, or genre in the search bar above
              to find what you're looking for.
            </p>
            <div className="suggestions-box">
              <div className="suggestions-title">
                <TrendingUp size={16} color="#ffc13c" />
                Popular Searches
              </div>
              <ul className="suggestions-list">
                <li>Action movies</li>
                <li>Marvel movies</li>
                <li>Comedy films</li>
                <li>Horror movies</li>
                <li>Sci-fi classics</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
