import TVShowDetailsClient from "./TVShowDetailsClient";
import { getTVShowDetails } from "@/lib/tmdb";

const IMG = "https://image.tmdb.org/t/p";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const show = await getTVShowDetails(id);
    const title = show?.name ? `${show.name} - Flixet` : "TV Show - Flixet";
    const description =
      show?.overview?.slice(0, 160)?.trim() ||
      `Watch ${show?.name || "this TV show"} on Flixet.`;
    const image = show?.backdrop_path
      ? `${IMG}/w1280${show.backdrop_path}`
      : show?.poster_path
        ? `${IMG}/w500${show.poster_path}`
        : "/og-image.png";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "video.tv_show",
        images: [{ url: image, alt: show?.name || "TV show" }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "TV Show - Flixet",
      description: "Watch TV shows on Flixet.",
    };
  }
}

export default async function TVShowPage({ params }) {
  return <TVShowDetailsClient params={params} />;
}
