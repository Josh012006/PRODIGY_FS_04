import type { Metadata } from "next";
import "./globals.css";


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
      </head>
      <body className="text-sm lg:text-lg">{children}</body>
    </html>
  );
}
