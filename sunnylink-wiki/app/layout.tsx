import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BottomNav from '@/components/BottomNav';
import UniversalSearchTrigger from '@/components/UniversalSearchTrigger';
import GlobalControls from '@/components/GlobalControls';
import { LanguageProvider } from '@/lib/i18n';
import WebMCP from '@/components/WebMCP';
import SessionDonateModal from '@/components/SessionDonateModal';

const inter = localFont({
  src: "../public/fonts/InterVariable.woff2",
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Sunnylink Wiki | Cơ sở dữ liệu cài đặt Sunnypilot",
  description: "Wiki đầy đủ về Sunnypilot. Cơ sở dữ liệu cài đặt, mô hình lái và tính năng có thể tìm kiếm.",
  keywords: ["sunnylink", "sunnylink wiki", "sunnylink ai", "sunnypilot", "sunnypilot wiki", "sunnypilot features", "sunnylink app", "sunnypilot settings", "sunnypilot sunnylink", "sunnylink sunnypilot latest version", "openpilot", "MADS", "NNLC", "self-driving", "comma.ai", "settings", "toggles", "models"],
  openGraph: {
    title: "Sunnylink Wiki",
    description: "Wiki đầy đủ về Sunnypilot. Cài đặt, mô hình và tính năng.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunnylink Wiki",
    description: "Wiki đầy đủ về Sunnypilot. Cài đặt, mô hình và tính năng.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Theme bootstrap — applies saved/system theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (!t) {
                    t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  if (t === 'light') document.documentElement.classList.add('light');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased pb-20 md:pb-0 overflow-x-hidden" suppressHydrationWarning>
        <LanguageProvider>
          {children}
          <GlobalControls />
          <UniversalSearchTrigger />
          <BottomNav />
          <WebMCP />
          <SessionDonateModal />
        </LanguageProvider>
      </body>
    </html>
  );
}
