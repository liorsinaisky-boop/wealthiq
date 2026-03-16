import { ImageResponse } from "next/og";
import { createElement as h } from "react";
import type { NextRequest } from "next/server";

export const runtime = "edge";

function scoreColor(score: number): string {
  if (score >= 90) return "#22C55E";
  if (score >= 80) return "#4ADE80";
  if (score >= 70) return "#A3E635";
  if (score >= 60) return "#FACC15";
  if (score >= 50) return "#FB923C";
  if (score >= 40) return "#F87171";
  return "#EF4444";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = Math.min(100, Math.max(0, parseInt(searchParams.get("score") ?? "70")));
  const grade = searchParams.get("grade") ?? "B+";
  const color = scoreColor(score);

  // SVG arc for gauge
  const r = 110;
  const cx = 150;
  const cy = 150;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (score / 100) * circumference;

  const image = h(
    "div",
    {
      style: {
        width: "1200px",
        height: "630px",
        background: "linear-gradient(135deg, #0A0A0F 0%, #12121A 60%, #0A0A0F 100%)",
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 80px",
        fontFamily: "system-ui, sans-serif",
        position: "relative" as const,
        overflow: "hidden",
      },
    },
    // Gold top border
    h("div", {
      style: {
        position: "absolute" as const,
        top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, transparent, #D4A843, transparent)",
      },
    }),
    // Background glow blob
    h("div", {
      style: {
        position: "absolute" as const,
        top: "-80px", right: "-80px",
        width: "380px", height: "380px",
        background: "rgba(212,168,67,0.07)",
        borderRadius: "50%",
        filter: "blur(70px)",
      },
    }),
    // Left: branding
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "flex-start",
        gap: "18px",
        flex: 1,
      },
    },
      // Logo row
      h("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
        h("div", {
          style: {
            width: "44px", height: "44px",
            background: "linear-gradient(135deg, #D4A843, #C49A38)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px",
          },
        }, "💰"),
        h("span", {
          style: { fontSize: "30px", fontWeight: "900", color: "#D4A843", letterSpacing: "-0.5px" },
        }, "WealthIQ"),
      ),
      // Headline
      h("div", {
        style: { fontSize: "54px", fontWeight: "900", color: "#FFFFFF", lineHeight: 1.1, maxWidth: "480px" },
      }, "הציון הפיננסי שלי"),
      // Sub
      h("div", {
        style: { fontSize: "22px", color: "#6B7280", maxWidth: "420px", lineHeight: 1.4 },
      }, 'פנסיה, נדל"ן, השקעות, חסכונות — הכל במקום אחד'),
      // CTA badge
      h("div", {
        style: {
          marginTop: "8px",
          background: "rgba(212,168,67,0.1)",
          border: "1px solid rgba(212,168,67,0.3)",
          borderRadius: "100px",
          padding: "10px 24px",
          fontSize: "18px", color: "#D4A843", fontWeight: "600",
        },
      }, "בדוק גם אתה → wealthiq.co.il"),
    ),
    // Right: score gauge
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: "20px",
      },
    },
      // Gauge container
      h("div", { style: { position: "relative" as const, width: "300px", height: "300px", display: "flex" } },
        h("svg", { width: 300, height: 300, style: { transform: "rotate(-90deg)" } },
          h("circle", { cx, cy, r, fill: "none", stroke: "rgba(30,30,46,0.8)", strokeWidth: 14 }),
          h("circle", {
            cx, cy, r, fill: "none", stroke: color, strokeWidth: 14,
            strokeLinecap: "round",
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
            style: { filter: `drop-shadow(0 0 10px ${color})` },
          }),
        ),
        // Center text
        h("div", {
          style: {
            position: "absolute" as const, inset: 0,
            display: "flex", flexDirection: "column" as const,
            alignItems: "center", justifyContent: "center", gap: "4px",
          },
        },
          h("span", {
            style: { fontSize: "90px", fontWeight: "900", color, lineHeight: 1 },
          }, String(score)),
          h("span", { style: { fontSize: "16px", color: "#6B7280" } }, "מתוך 100"),
        ),
      ),
      // Grade badge
      h("div", {
        style: {
          background: `${color}20`, border: `2px solid ${color}60`,
          borderRadius: "14px", padding: "12px 40px",
          fontSize: "30px", fontWeight: "900", color,
        },
      }, grade),
    ),
    // Gold bottom border
    h("div", {
      style: {
        position: "absolute" as const,
        bottom: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, transparent, #D4A843, transparent)",
      },
    }),
  );

  return new ImageResponse(image, { width: 1200, height: 630 });
}
