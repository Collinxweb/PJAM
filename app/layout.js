import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { isOfrendaActive } from "@/lib/theme";

const SITE_URL = "https://pjam.site"; // update this if the domain ever changes

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PJAM — One prompt. One shot. Prove it.",
  description: "Real prompt-engineering challenges, scored by a real AI judge. Battle Claude, ChatGPT, Grok, and Gemini, climb 100+ real levels, or challenge friends in tournaments and Daily Rush.",
  openGraph: {
    title: "PJAM — One prompt. One shot. Prove it.",
    description: "Real prompt-engineering challenges, scored by a real AI judge. Battle real AI opponents, climb real levels, challenge friends.",
    url: SITE_URL,
    siteName: "PJAM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PJAM — One prompt. One shot. Prove it.",
    description: "Real prompt-engineering challenges, scored by a real AI judge.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-body">
        <ThemeProvider>
          {isOfrendaActive() && <div className="ofrenda-atmosphere" aria-hidden="true"><span>✿</span><span>✾</span><span>✿</span></div>}
          <div className="max-w-sm mx-auto pb-20 relative min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
