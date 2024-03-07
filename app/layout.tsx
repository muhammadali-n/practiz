import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../themes/main.scss";
import GlobalState from "./context";
import { Suspense } from "react";
import Navbar from '../components/layout/navbar';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store Accelerator",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalState>
      <html lang="en">
        <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
          <Navbar />
          <Suspense>
            <main>{children}</main>
          </Suspense>
        </body>
      </html>
    </GlobalState>
  );
}
