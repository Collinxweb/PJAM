import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: "PJAM — Prompt Quest",
  description: "Real prompt-engineering challenges, scored on accuracy, efficiency, and style.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <ThemeProvider>
          <div className="max-w-sm mx-auto pb-20 relative min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
