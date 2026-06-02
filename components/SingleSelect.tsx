"use client";

interface Props {
  question: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  showOtherInput?: boolean;
  otherLabel?: string;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}

export default function SingleSelect({
  question,
  options,
  value,
  onChange,
  showOtherInput,
  otherLabel = "Please specify",
  otherValue = "",
  onOtherChange,
}: Props) {
  const isOtherSelected = value === "Other";

  return (
    <div>
      <h2
        style={{
          fontSize: "clamp(18px, 4vw, 22px)",
          fontWeight: 700,
          color: "#FFFFFF",
          marginBottom: 28,
          lineHeight: 1.3,
        }}
      >
        {question}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                textAlign: "left",
                padding: "14px 18px",
                borderRadius: 10,
                border: selected
                  ? "1.5px solid #4ECBA0"
                  : "1.5px solid #2E2E2E",
                backgroundColor: selected ? "#4ECBA015" : "#222222",
                color: selected ? "#FFFFFF" : "#CCCCCC",
                fontSize: 15,
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: selected ? "2px solid #4ECBA0" : "2px solid #444",
                  backgroundColor: selected ? "#4ECBA0" : "transparent",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}
              />
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {showOtherInput && isOtherSelected && onOtherChange && (
        <div style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder={otherLabel}
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1.5px solid #2E2E2E",
              backgroundColor: "#222",
              color: "#FFF",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
