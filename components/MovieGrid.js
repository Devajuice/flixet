'use client';
import MovieCard from './MovieCard';

export default function MovieGrid({ movies, title }) {
  if (!movies || movies.length === 0) return null;

  return (
    <>
      <style jsx>{`
        .section {
          margin-bottom: 40px;
          width: 100%;
        }

        .section-title {
          font-size: 20px;
          margin-bottom: 15px;
          font-weight: bold;
          padding: 0 5px;
        }

        .movie-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
        }

        @media (min-width: 640px) {
          .movie-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
          }

          .section-title {
            font-size: 26px;
          }
        }

        @media (min-width: 1024px) {
          .movie-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 18px;
          }

          .section-title {
            font-size: 32px;
          }
        }

        @media (min-width: 1280px) {
          .movie-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 20px;
          }
        }
      `}</style>

      <section className="section">
        {title && <h2 className="section-title">{title}</h2>}
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </>
  );
}
