"use client";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Star,
  Film,
  Tv,
  Award,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MediaCard from "@/components/MediaCard";
import ScrollRow from "@/components/ScrollRow";
import {
  Skeleton as SkeletonEl,
  SkeletonText,
} from "@/components/Skeleton";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMG = "https://image.tmdb.org/t/p";

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildCredits(combined) {
  const cast = combined?.cast || [];
  const crew = combined?.crew || [];
  const seen = new Set();
  const all = [];
  cast.forEach((c) => {
    const key = `${c.media_type}-${c.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    all.push({ ...c, role: c.character || c.job || "" });
  });
  crew.forEach((c) => {
    const key = `${c.media_type}-${c.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    all.push({ ...c, role: c.job || c.character || "" });
  });
  return all.sort(
    (a, b) => (b.popularity || 0) - (a.popularity || 0),
  );
}

function PersonDetailsContent({ params }) {
  const resolvedParams = use(params);
  const personId = resolvedParams?.id;

  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("all");

  const [prevPersonId, setPrevPersonId] = useState(personId);
  if (personId !== prevPersonId) {
    setPrevPersonId(personId);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    if (!personId) return;
    fetch(
      `https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}&append_to_response=combined_credits`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.success === false || data.status_code)
          throw new Error(
            data.status_message || "Failed to fetch person data",
          );
        setPerson(data);
        setCredits(buildCredits(data.combined_credits));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [personId]);

  if (loading)
    return (
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 var(--container-padding)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            alignItems: "center",
            padding: "40px 0",
          }}
        >
          <SkeletonEl
            width={200}
            height={280}
            borderRadius="var(--radius-xl)"
          />
          <div style={{ flex: 1, minWidth: 260 }}>
            <SkeletonEl width="50%" height={44} borderRadius="var(--radius-md)" />
            <div style={{ marginTop: 16 }}>
              <SkeletonText width="70%" />
              <SkeletonText width="90%" />
              <SkeletonText width="60%" />
            </div>
          </div>
        </div>
      </div>
    );

  if (error || !person)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
          textAlign: "center",
          padding: 20,
        }}
      >
        <p
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--font-bold)",
            color: "var(--accent)",
            marginBottom: 12,
          }}
        >
          {error ? "Error Loading Person" : "Person Not Found"}
        </p>
        <p style={{ color: "var(--text-tertiary)", marginBottom: 24 }}>
          {error || "This person doesn't exist."}
        </p>
        <Link href="/">
          <button className="btn btn-primary">Back to Home</button>
        </Link>
      </div>
    );

  const profile = person.profile_path
    ? `${IMG}/w500${person.profile_path}`
    : null;
  const birthDate = formatDate(person.birthday);
  const deathDate = formatDate(person.deathday);
  const knownFor = credits
    .filter((c) => c.poster_path && (c.title || c.name))
    .slice(0, 12);
  const movies = credits.filter(
    (c) => c.media_type === "movie" && c.poster_path,
  );
  const tvShows = credits.filter(
    (c) => c.media_type === "tv" && c.poster_path,
  );

  const showItems =
    tab === "all" ? knownFor : tab === "movies" ? movies : tvShows;

  const bioParagraphs =
    person.biography
      ?.split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean) || [];

  const infoItems = [
    { icon: <Award size={16} />, label: "Known For", value: person.known_for_department || "—" },
    { icon: <Star size={16} />, label: "Popularity", value: person.popularity ? person.popularity.toFixed(1) : "—" },
    { icon: <Calendar size={16} />, label: "Born", value: birthDate || "—" },
    { icon: <Calendar size={16} />, label: "Died", value: deathDate || "—" },
    { icon: <MapPin size={16} />, label: "Birth Place", value: person.place_of_birth || "—" },
  ];

  const tabDefs = [
    {
      id: "all",
      label: `Known For (${knownFor.length})`,
      icon: <Star size={14} />,
    },
    {
      id: "movies",
      label: `Movies (${movies.length})`,
      icon: <Film size={14} />,
    },
    {
      id: "tv",
      label: `TV Shows (${tvShows.length})`,
      icon: <Tv size={14} />,
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "0 var(--container-padding)",
      }}
    >
      {/* Profile header */}
      <div
        className="person-header"
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          alignItems: "flex-start",
          padding: "40px 0 32px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            width: 200,
            aspectRatio: "2/3",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            background: "var(--bg-tertiary)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          {profile ? (
            <Image
              src={profile}
              alt={person.name}
              fill
              sizes="200px"
              priority
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 56,
                color: "var(--text-muted)",
              }}
            >
              <User size={72} />
            </div>
          )}
        </motion.div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              lineHeight: 1.1,
              fontWeight: "var(--font-extrabold)",
              letterSpacing: "-0.025em",
              color: "var(--text-primary)",
              margin: "0 0 8px",
            }}
          >
            {person.name}
          </h1>
          {person.known_for_department && (
            <p
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-semibold)",
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 24px",
              }}
            >
              {person.known_for_department}
            </p>
          )}

          <div
            className="person-info-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 10,
              marginBottom: 28,
            }}
          >
            {infoItems.map((it) => (
              <div
                key={it.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <span style={{ color: "var(--accent)", flexShrink: 0 }}>
                  {it.icon}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--text-tertiary)",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {it.label}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--font-semibold)",
                      color: "var(--text-secondary)",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {it.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {bioParagraphs.length > 0 && (
            <div>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-bold)",
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                Biography
              </p>
              {bioParagraphs.slice(0, 3).map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.8,
                    color: "var(--text-secondary)",
                    margin: "0 0 12px",
                    maxWidth: 720,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="person-tabs"
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        {tabDefs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="btn"
            style={{
              padding: "9px 16px",
              fontSize: "var(--text-sm)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background:
                tab === t.id ? "var(--accent)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${tab === t.id ? "var(--accent)" : "var(--border)"}`,
              color: tab === t.id ? "#fff" : "var(--text-secondary)",
              fontWeight: tab === t.id ? "var(--font-bold)" : "var(--font-medium)",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Known for / credits grid */}
      {tab === "all" ? (
        <ScrollRow style={{ marginBottom: 60 }}>
          {showItems.map((c, i) => (
            <MediaCard
              key={`${c.media_type}-${c.id}`}
              item={c}
              type={c.media_type === "movie" ? "movie" : "tv"}
              index={i}
            />
          ))}
        </ScrollRow>
      ) : showItems.length > 0 ? (
        <div
          className="person-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 16,
            marginBottom: 60,
            justifyItems: "center",
          }}
        >
          {showItems.map((c, i) => (
            <MediaCard
              key={`${c.media_type}-${c.id}`}
              item={c}
              type={c.media_type === "movie" ? "movie" : "tv"}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--text-tertiary)",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-semibold)",
            }}
          >
            No {tab === "movies" ? "movies" : "TV shows"} found for this person.
          </p>
        </div>
      )}

      <style jsx global>{`
        .person-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
          justify-items: center;
        }
        @media (max-width: 768px) {
          .person-grid {
            gap: 12px;
          }
        }
        @media (max-width: 480px) {
          .person-grid {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default function PersonPage({ params }) {
  return <PersonDetailsContent params={params} />;
}
