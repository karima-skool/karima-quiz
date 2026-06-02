"use client";

interface Props {
  question: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
  optional?: boolean;
}

export default function TextInput({
  question,
  value,
  onChange,
  maxLength = 200,
  optional,
}: Props) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontSize: "clamp(18px, 4vw, 22px)",
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: 8,
            lineHeight: 1.3,
          }}
        >
          {question}
        </h2>
        {optional && (
          <span
            style={{
              fontSize: 13,
              color: "#A0A0A0",
              fontStyle: "italic",
            }}
          >
            Optional — skip if you prefer
          </span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
        rows={4}
        placeholder="Type your answer here..."
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 10,
          border: "1.5px solid #2E2E2E",
          backgroundColor: "#222222",
          color: "#FFFFFF",
          fontSize: 15,
          fontFamily: "inherit",
          resize: "none",
          outline: "none",
          lineHeight: 1.5,
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#4ECBA040")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#2E2E2E")}
      />
      <div
        style={{
          textAlign: "right",
          fontSize: 12,
          color: "#555",
          marginTop: 6,
        }}
      >
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
