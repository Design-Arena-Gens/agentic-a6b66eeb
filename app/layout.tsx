import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ShaktiFlow Motivator',
  description:
    'Short, powerful, yogic fitness motivation for instant sharing to WhatsApp, Telegram, and X.',
  metadataBase: new URL('https://agentic-a6b66eeb.vercel.app')
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="brand">
              <div className="brand-badge" />
              <div>
                <div className="brand-title">ShaktiFlow Motivator</div>
                <div className="subtitle">
                  Uplifting. Yogic. Modern. 10?20 word shareables.
                </div>
              </div>
            </div>
          </header>
          {children}
          <footer className="footer">
            Built for Sheryl?s community ? Copy or share instantly
          </footer>
        </div>
      </body>
    </html>
  );
}

