import type { Metadata } from "next";
import { Caesar_Dressing } from "next/font/google";
import "./globals.scss";
import styles from "./layout.module.scss";

const fontCaesarDressing = Caesar_Dressing({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Timbiriche",
  description: "Timbiriche (dots and boxes) game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontCaesarDressing.className}>
        <h1 className={styles.logo}>Timbiriche</h1>

        <div className={styles.main}>{children}</div>
      </body>
    </html>
  );
}
