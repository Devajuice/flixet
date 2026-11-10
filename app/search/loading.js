import { SkeletonCard } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px var(--container-padding) 60px" }}>
      <div className="skeleton" style={{ width: "40%", height: 32, borderRadius: 8, marginBottom: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} width={160} height={240} />
        ))}
      </div>
    </div>
  );
}
