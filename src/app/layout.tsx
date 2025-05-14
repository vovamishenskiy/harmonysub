import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import { Roboto } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin", "cyrillic"], weight: ['100', '300', '400', '500', '700', '900'] });

export const metadata: Metadata = {
  title: "Harmonysub",
  description: "Отслеживайте Ваши подписки",
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
      <head>
        <Script
          src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={roboto.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
