import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rafa Castello | Design Leader",
  description:
    "Chat with an AI assistant to learn about Rafa Castello's design work, experience, and services.",
  openGraph: {
    title: "Rafa Castello | Design Leader",
    description:
      "Chat with an AI assistant to learn about Rafa Castello's design work, experience, and services.",
    url: "https://rafacastello.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Adobe Fonts - Europa and Freight Display Pro */}
        <link rel="stylesheet" href="https://use.typekit.net/xxxxxxx.css" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
