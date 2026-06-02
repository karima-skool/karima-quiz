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
  const selectedDisplay = selectedAsLabels ?? selected;
  const atMax = maxSelect !== undefined && selectedDisplay.length >= maxSelect;

  function toggle(opt: string) {
    const isSelected = selectedDisplay.includes(opt);
    if (!isSelected && atMax) return;
    const next = isSelected
      ? selectedDisplay.filter((s) => s !== opt)
      : [...selectedDisplay, opt];
    onChange(next);
  }

  const isOtherSelected = selectedDisplay.includes("Other");

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

      {atMax && maxNote && (
        <p style={{ fontSize: 13, color: "rgb(129, 79, 255)", marginBottom: 12, marginTop: -8 }}>
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
                padding: "14px 16px",
                borderRadius: 12,
                border: isSelected
                  ? "1.5px solid rgb(129, 79, 255)"
                  : "1px solid #e0e0e0",
                backgroundColor: isSelected
                  ? "rgba(129, 79, 255, 0.08)"
                  : isDisabled
                  ? "#f5f5f5"
                  : "#ffffff",
                color: isDisabled ? "#c0c0c0" : "#000000",
                fontSize: 15,
                cursor: isDisabled ? "not-allowed" : "pointer",
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
                borderRadius: 4,
                border: isSelected
                  ? "2px solid rgb(129, 79, 255)"
                  : isDisabled
                  ? "2px solid #c0c0c0"
                  : "2px solid #c0c0c0",
                backgroundColor: isSelected ? "rgb(129, 79, 255)" : "transparent",
                flexShrink: 0,
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {isSelected && (
                  <span style={{ color: "#ffffff", fontSize: 11, fontWeight: 800, lineHeight: 1 }}>
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
