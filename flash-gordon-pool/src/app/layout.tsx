import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flash Gordon Pool | Professional Pool Player & Coach",
  description:
    "Flash Gordon Pool — Scott Gordon. Professional billiards player, coach, and sci-fi space warrior of the pool table. Book coaching sessions, follow tournament results, and join the legend.",
  keywords: ["pool player", "billiards coach", "Flash Gordon Pool", "Scott Gordon", "pool coaching", "billiards"],
  openGraph: {
    title: "Flash Gordon Pool",
    description: "Professional billiards player. Sci-fi space warrior. Coach. Legend in the making.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#080f18] text-[#e8e8e8]">
        {children}
      </body>
    </html>
  );
}
