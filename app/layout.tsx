import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Koinsave",
  description: "Koinsave Frontend App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  );
}
