import CatalogPage from "@/components/CatalogPage";

const GENRE_MAP = {
  action: 10759,
  comedy: 35,
  drama: 18,
  horror: 9648,
  "sci-fi": 10765,
  thriller: 9648,
  romance: 10749,
  animation: 16,
};

const GENRES = [
  { id: 10759, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
];

const GENRE_NAMES = Object.fromEntries(GENRES.map((g) => [g.id, g.name]));

export default function TVPage() {
  return (
    <CatalogPage
      type="tv"
      genres={GENRES}
      genreNames={GENRE_NAMES}
      genreMap={GENRE_MAP}
      dateField="first_air_date"
      pluralLabel="TV Shows"
    />
  );
}
