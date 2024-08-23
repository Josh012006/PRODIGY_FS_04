
import type { Metadata } from "next";
import "./globals.css";

import { Roboto } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });


export const metadata: Metadata = {
  title: "Echo",
  description: "The revolutionary real-time chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
        <script src="https://kit.fontawesome.com/f1ed3a95ea.js" crossOrigin="anonymous" defer></script>
      </head>
      <body className={`text-sm lg:text-base min-h-screen h-full bg-isabelline ${roboto.className}`}>
        {children}
      </body>
    </html>
  );
}
