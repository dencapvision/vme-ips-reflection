import type { Metadata, Viewport } from "next";
import { Sarabun, Playfair_Display } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IPS Reflect — สมุดสรุปบทเรียน VME",
  description: "เครื่องมือสรุปบทเรียน · ทบทวนความรู้ · วางแผนนำไปใช้งาน",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF7F1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${sarabun.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-gray-50 selection:bg-blue-100">
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
