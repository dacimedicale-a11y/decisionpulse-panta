import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecisionPulse — Prediction Markets → Decisions",
  description:
    "Turn Panta prediction-market probabilities into decision signals, watchlists and scenario triggers."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
