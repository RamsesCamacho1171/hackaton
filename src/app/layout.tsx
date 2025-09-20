import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: { default: "Portal Inventario", template: "%s | Portal Inventario" },
  description: "Demo de inventario hospitalario con Next.js + Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-dvh bg-zinc-50 text-zinc-900 antialiased flex flex-col">
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
          <Navbar />
        </header>

        {/* EL TRUCO: flex-1 para empujar el footer */}
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
          {children}
        </main>

        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-sm text-zinc-600">
            © {new Date().getFullYear()} Demo · Inventario Hospitalario
          </div>
        </footer>
      </body>
    </html>
  );
}