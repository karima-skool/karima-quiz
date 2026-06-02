"use client";

interface Props {
  question: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelect?: number;
  maxNote?: string;
  showOtherInput?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  // For Q3 where internal values differ from display labels
  selectedAsLabels?: string[];
}

export default function MultiSelect({
  question,
  options,
  selected,
  onChange,
  maxSelect,
  maxNote,
  showOtherInput,
  otherValue = "",
  onOtherChange,
  selectedAsLabels,
}: Props) {
  // selectedDisplay is what we compare option labels against
  const selectedDisplay = selectedAsLabels ?? selected;
  const atMax = maxSelect !== undefined && selectedDisplay.length >= maxSelect;

  function toggle(opt: string) {
    const isSelected = selectedDisplay.includes(opt);
    if (!isSelected && atMax) return; // at max, ignore
    const next = isSelected
      ? selectedDisplay.filter((s) => s !== opt)
      : [...selectedDisplay, opt];
    onChange(next);
  }

  const isOtherSelected = selectedDisplay.includes("Other");

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

      {atMax && maxNote && (
        <p
          style={{
            fontSize: 13,
            color: "#4ECBA0",
            marginBottom: 12,
            marginTop: -12,
          }}
        >
          {maxNote}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt) => {
          const isSelected = selectedDisplay.includes(opt);
          const isDisabled = !isSelected && atMax;
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              disabled={isDisabled}
              style={{
                textAlign: "left",
                padding: "14px 18px",
                borderRadius: 10,
                border: isSelected
                  ? "1.5px solid #4ECBA0"
                  : "1.5px solid #2E2E2E",
                backgroundColor: isSelected
                  ? "#4ECBA015"
                  : isDisabled
                  ? "#1c1c1c"
                  : "#222222",
                color: isSelected ? "#FFFFFF" : isDisabled ? "#444" : "#CCCCCC",
                fontSize: 15,
                cursor: isDisabled ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                fontFamily: "inherit",
                lineHeight: 1.4,
                opacity: isDisabled ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: isSelected ? "2px solid #4ECBA0" : "2px solid #444",
                  backgroundColor: isSelected ? "#4ECBA0" : "transparent",
                  flexShrink: 0,
                  transition: "all 0.15s",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      color: "#1A1A1A",
                      fontSize: 11,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                )}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {showOtherInput && isOtherSelected && onOtherChange && (
        <div style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder="Please specify"
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
