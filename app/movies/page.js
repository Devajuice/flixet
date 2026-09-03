import CatalogPage from "@/components/CatalogPage";

const GENRE_MAP = {
  action: 28,
  comedy: 35,
  drama: 18,
  horror: 27,
  "sci-fi": 878,
  thriller: 53,
  romance: 10749,
  animation: 16,
};

const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
];

const GENRE_NAMES = Object.fromEntries(GENRES.map((g) => [g.id, g.name]));

export default function MoviesPage() {
  return (
    <CatalogPage
      type="movie"
      genres={GENRES}
      genreNames={GENRE_NAMES}
      genreMap={GENRE_MAP}
      dateField="primary_release_date"
      pluralLabel="Movies"
    />
  );
}
