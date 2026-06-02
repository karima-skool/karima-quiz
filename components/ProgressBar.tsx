"use client";

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ padding: "20px 24px 0", maxWidth: 600, margin: "0 auto", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#5e5e5e" }}>
          Question {current} of {total}
        </span>
        <span style={{ fontSize: 13, color: "rgb(129, 79, 255)", fontWeight: 600 }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 5, backgroundColor: "#e8e0ff", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: "linear-gradient(90deg, rgb(129, 79, 255), rgb(63, 15, 201))",
          borderRadius: 99,
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}
