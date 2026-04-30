"use client";
import { motion } from "framer-motion";

export function Skeleton({
  width = "100%",
  height = 200,
  borderRadius = "var(--radius-lg)",
  style = {},
}) {
  return (
    <motion.div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        flexShrink: 0,
        ...style,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
}

export function SkeletonCard({ width = 140, height = 210 }) {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius="var(--radius-lg)"
      style={{ flexShrink: 0 }}
    />
  );
}

export function SkeletonWide({ width = 240, height = 135 }) {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius="var(--radius-lg)"
      style={{ flexShrink: 0 }}
    />
  );
}

export function SkeletonHero() {
  return (
    <Skeleton
      width="100%"
      height="clamp(320px, 65vh, 700px)"
      borderRadius={0}
      style={{ flexShrink: 0 }}
    />
  );
}

export function SkeletonText({ width = "60%", height = 16, style = {} }) {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius="var(--radius-sm)"
      style={{ marginBottom: 8, ...style }}
    />
  );
}

export function SkeletonTitle({ width = "40%", height = 32 }) {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius="var(--radius-sm)"
      style={{ marginBottom: 16 }}
    />
  );
}
