import PersonDetailsClient from "./PersonDetailsClient";
import { getPersonDetails } from "@/lib/tmdb";

const IMG = "https://image.tmdb.org/t/p";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const person = await getPersonDetails(id);
    const title = person?.name ? `${person.name} - Flixet` : "Person - Flixet";
    const description =
      person?.biography?.slice(0, 160)?.trim() ||
      `View details and credits for ${person?.name || "this person"} on Flixet.`;
    const image = person?.profile_path ? `${IMG}/w500${person.profile_path}` : "/og-image.png";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image, alt: person?.name || "Person profile" }],
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
      title: "Person - Flixet",
      description: "View person details on Flixet.",
    };
  }
}

export default async function PersonPage({ params }) {
  return <PersonDetailsClient params={params} />;
}
