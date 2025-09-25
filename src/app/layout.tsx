import type { Metadata } from "next";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import { RouteProgress } from "@/components/RouteProgress";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Employee Rating Hub",
  description: "Система управления персоналом с рейтингами и активностью пользователей",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <ErrorReporter />
        {children}
      </body>
    </html>
  );
}