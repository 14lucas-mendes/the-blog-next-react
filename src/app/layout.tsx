import type { Metadata } from "next";
import "./globals.css";
import Container from "@/components/Container";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteDescription, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: "The Blog", template: "%s | The Blog" },
  description: siteDescription,
  openGraph: {
    title: "The Blog", description: siteDescription,
    type: "website", locale: "pt_BR", siteName: "The Blog",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:text-slate-900 focus:p-4">
          Pular para o conteúdo
        </a>
        <Container>
          <Header />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
        </Container>
      </body>
    </html>
  );
}

