import type { Metadata } from "next";
// Temporarily commented out due to network connectivity issues during build
// import { Poppins } from "next/font/google";
import "./globals.css";

// Using system fonts as fallback
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   variable: "--font-poppins",
// });

export const metadata: Metadata = {
  title: "AuraClinic - Doctor Management",
  description: "Advanced clinic management portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased text-gray-900 bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
