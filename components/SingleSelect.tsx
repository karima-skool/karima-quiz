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
      <h2 style={{
        fontSize: "clamp(18px, 4vw, 22px)",
        fontWeight: 700,
        color: "#040313",
        marginBottom: 24,
        lineHeight: 1.3,
      }}>
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
                padding: "14px 16px",
                borderRadius: 12,
                border: selected ? "1.5px solid rgb(129, 79, 255)" : "1px solid #e0e0e0",
                backgroundColor: selected ? "rgba(129, 79, 255, 0.08)" : "#ffffff",
                color: "#000000",
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
              <span style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: selected ? "2px solid rgb(129, 79, 255)" : "2px solid #c0c0c0",
                backgroundColor: selected ? "rgb(129, 79, 255)" : "transparent",
                flexShrink: 0,
                transition: "all 0.15s",
              }} />
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
              borderRadius: 10,
              border: "1px solid #e0e0e0",
              backgroundColor: "#ffffff",
              color: "#000000",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgb(129, 79, 255)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
          />
        </div>
      )}
    </div>
  );
}
