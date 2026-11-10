import { Skeleton as SkeletonEl, SkeletonText } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 var(--container-padding)" }}>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center", padding: "40px 0" }}>
        <SkeletonEl width={200} height={280} borderRadius="var(--radius-xl)" />
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
}
