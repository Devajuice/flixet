const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const DEFAULT_REVALIDATE = 3600;

// This route is an unauthenticated public endpoint, so it must not become a
// general-purpose passthrough to TMDB. Only the resources lib/tmdbClient.js
// actually calls are accepted.
const ALLOWED_RESOURCES = new Set([
  "movie",
  "tv",
  "trending",
  "discover",
  "person",
  "search",
]);

function revalidateFor(path) {
  if (path.startsWith("search/")) return 300;
  if (path.includes("external_ids")) return 86400;
  return DEFAULT_REVALIDATE;
}

export async function GET(request, { params }) {
  const apiKey =
    process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    return Response.json(
      { status_message: "TMDB API key is not configured" },
      { status: 500 },
    );
  }

  const { path: segments } = await params;
  const path = Array.isArray(segments) ? segments.join("/") : segments;

  if (!path) {
    return Response.json({ error: "Missing path" }, { status: 400 });
  }

  // Reject anything that is not a known TMDB resource, plus path traversal and
  // absolute URLs that would otherwise redirect the server-keyed fetch.
  const parts = path.split("/");
  const isSafe =
    parts.every(
      (s) => s.length > 0 && s !== "." && s !== ".." && !s.includes("\\"),
    ) && ALLOWED_RESOURCES.has(parts[0]);

  if (!isSafe) {
    return Response.json({ error: "Unsupported TMDB resource" }, { status: 400 });
  }

  const incoming = new URL(request.url).searchParams;
  incoming.delete("api_key");
  incoming.set("api_key", apiKey);

  const revalidate = revalidateFor(path);

  try {
    const res = await fetch(`${TMDB_BASE_URL}/${path}?${incoming}`, {
      next: { revalidate },
      headers: { accept: "application/json" },
    });

    return new Response(await res.text(), {
      status: res.status,
      headers: {
        "content-type":
          res.headers.get("content-type") || "application/json",
        "cache-control": `public, s-maxage=${revalidate}, stale-while-revalidate=86400`,
      },
    });
  } catch (error) {
    return Response.json(
      { status_message: "Failed to reach TMDB" },
      { status: 502 },
    );
  }
}