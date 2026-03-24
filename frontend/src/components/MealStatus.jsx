import React from "react";

export default function MealStatus({ label, icon, available }) {
  const statusColor = available ? "#16a34a" : "#dc2626";
  const statusBg = available ? "#dcfce7" : "#fee2e2";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "6px",
        fontSize: "14px",
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        {label}
        <span
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "999px",
            background: statusBg,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: statusColor,
          }}
        >
          {available ? "✓" : "✗"}
        </span>
      </span>
    </div>
  );
}
