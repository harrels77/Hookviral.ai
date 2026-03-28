import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/Themeprovider";

export const metadata: Metadata = {
  title: "HookViral AI — Stop the Scroll in 3 Seconds",
  description: "Generate 8 viral hooks in seconds. Free to start.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Nav />
          <main style={{ paddingTop: "var(--nav-h)" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}