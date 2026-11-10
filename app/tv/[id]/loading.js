import { Skeleton as SkeletonEl, SkeletonText, SkeletonTitle } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <SkeletonEl width="100%" height="70vh" minHeight={400} borderRadius={0} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 var(--container-padding)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 40, marginTop: -80, position: "relative", zIndex: 1 }}>
          <SkeletonEl width={260} height={390} borderRadius="var(--radius-xl)" />
          <div style={{ paddingTop: 80 }}>
            <SkeletonTitle width="60%" height={52} />
            <SkeletonText width="100%" />
            <SkeletonText width="80%" />
            <SkeletonText width="65%" />
          </div>
        </div>
      </div>
    </div>
  );
}
