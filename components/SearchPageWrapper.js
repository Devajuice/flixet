'use client';

import SearchResults from '@/components/SearchResults';
import { Search, Film, TrendingUp } from 'lucide-react';

export default function SearchPageWrapper({ query, data }) {
  return (
    <>
      <style jsx>{`
        .search-container {
          padding: 40px 20px 100px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .search-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .search-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 15px;
          background: linear-gradient(135deg, #e50914 0%, #f40612 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .search-query {
          color: var(--text-primary);
          font-weight: 800;
        }

        .search-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          margin-top: 10px;
        }

        .results-count {
          background: rgba(229, 9, 20, 0.1);
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 20px;
          padding: 8px 20px;
          display: inline-block;
          margin-top: 15px;
          font-weight: 600;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 20px;
          text-align: center;
        }

        .empty-icon {
          opacity: 0.3;
        }

        .empty-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .empty-text {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 500px;
          line-height: 1.6;
          margin: 0;
        }

        .suggestions-box {
          background: rgba(26, 26, 26, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 25px;
          margin-top: 30px;
          backdrop-filter: blur(10px);
          max-width: 600px;
        }

        .suggestions-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 15px;
        }

        .suggestions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .suggestions-list li {
          padding: 10px 0 10px 25px;
          position: relative;
          color: var(--text-secondary);
          line-height: 1.6;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .suggestions-list li:last-child {
          border-bottom: none;
        }

        .suggestions-list li:before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-weight: bold;
        }

        .no-results-box {
          background: linear-gradient(
            135deg,
            rgba(229, 9, 20, 0.1) 0%,
            rgba(26, 26, 26, 0.6) 100%
          );
          border: 1px solid rgba(229, 9, 20, 0.3);
          border-radius: 12px;
          padding: 30px;
          margin-top: 30px;
          max-width: 600px;
        }

        .no-results-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--accent);
          margin: 0 0 15px 0;
        }

        @media (max-width: 768px) {
          .search-container {
            padding: 30px 15px 80px;
          }

          .search-title {
            font-size: 28px;
            gap: 10px;
          }

          .search-subtitle {
            font-size: 16px;
          }

          .empty-title {
            font-size: 24px;
          }

          .empty-text {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="search-container">
        {query ? (
          <>
            <div className="search-header">
              <h1 className="search-title">
                <Search size={40} />
                Search Results
              </h1>
              <p className="search-subtitle">
                Showing results for:{' '}
                <span className="search-query">"{query}"</span>
              </p>
              {data.results.length > 0 && (
                <div className="results-count">
                  <Film
                    size={16}
                    style={{
                      display: 'inline',
                      marginRight: '8px',
                      verticalAlign: 'middle',
                    }}
                  />
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
                  size={80}
                  className="empty-icon"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <h2 className="empty-title">No movies found</h2>
                <p className="empty-text">
                  We couldn't find any movies matching "{query}". Try adjusting
                  your search or explore our suggestions below.
                </p>

                <div className="no-results-box">
                  <h3 className="no-results-title">Search Tips:</h3>
                  <ul className="suggestions-list">
                    <li>Check your spelling</li>
                    <li>Try different keywords</li>
                    <li>Use more general terms</li>
                    <li>Search by movie title, actor, or genre</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Search
              size={80}
              className="empty-icon"
              style={{ color: 'var(--text-secondary)' }}
            />
            <h2 className="empty-title">Start Your Search</h2>
            <p className="empty-text">
              Enter a movie title, actor name, or genre in the search bar above
              to find what you're looking for.
            </p>

            <div className="suggestions-box">
              <div className="suggestions-title">
                <TrendingUp size={20} color="#e50914" />
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
