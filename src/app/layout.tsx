import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin", "cyrillic"], weight: ['100', '300', '400', '500', '700', '900'] });


export const metadata: Metadata = {
  title: "Harmonysub",
  description: "Управляйте Вашими подписками",
};

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
