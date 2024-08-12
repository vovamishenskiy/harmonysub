import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "./providers";
import type { Viewport } from "next";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin", "cyrillic"], weight: ['100', '300', '400', '500', '700', '900'] });

export const metadata: Metadata = {
  title: "Harmonysub",
  description: "Управляйте Вашими подписками",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={roboto.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
