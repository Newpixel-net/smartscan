import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/auth/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartScan - AI-Powered Security Vulnerability Scanner',
  description: 'Detect security vulnerabilities in your web applications with AI-powered analysis. Get detailed reports and actionable fixes.',
  keywords: ['security scanner', 'vulnerability detection', 'web security', 'AI security', 'code analysis'],
  authors: [{ name: 'SmartScan' }],
  openGraph: {
    title: 'SmartScan - AI-Powered Security Vulnerability Scanner',
    description: 'Detect security vulnerabilities in your web applications with AI-powered analysis.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartScan - AI Security Scanner',
    description: 'AI-powered vulnerability detection for web applications',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-950">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f1f5f9',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f1f5f9',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
