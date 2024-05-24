import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simule sua economia!",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
