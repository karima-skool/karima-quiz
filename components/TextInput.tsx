"use client";

interface Props {
  question: string;
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
  optional?: boolean;
}

export default function TextInput({ question, value, onChange, maxLength = 200, optional }: Props) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontSize: "clamp(18px, 4vw, 22px)",
          fontWeight: 700,
          color: "#040313",
          marginBottom: optional ? 8 : 0,
          lineHeight: 1.3,
        }}>
          {question}
        </h2>
        {optional && (
          <span style={{ fontSize: 13, color: "#5e5e5e", fontStyle: "italic" }}>
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
          border: "1px solid #e0e0e0",
          backgroundColor: "#ffffff",
          color: "#000000",
          fontSize: 15,
          fontFamily: "inherit",
          resize: "none",
          outline: "none",
          lineHeight: 1.5,
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgb(129, 79, 255)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
      />
      <div style={{ textAlign: "right", fontSize: 12, color: "#5e5e5e", marginTop: 6 }}>
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
