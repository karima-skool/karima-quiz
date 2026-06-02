"use client";

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div
      style={{
        padding: "20px 24px 0",
        maxWidth: 560,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 12, color: "#A0A0A0" }}>
          Question {current} of {total}
        </span>
        <span style={{ fontSize: 12, color: "#4ECBA0", fontWeight: 600 }}>
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: 4,
          backgroundColor: "#2a2a2a",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: "#4ECBA0",
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
