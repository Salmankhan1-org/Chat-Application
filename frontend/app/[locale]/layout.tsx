import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapClient from "@/components/BootstrapClient";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/utils/context.provider";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_DEV_DOMAIN_URL}`),

  title: {
    default: "ChitChat – Real-time Messaging & AI Conversations",
    template: "%s | ChitChat",
  },

  description:
    "ChitChat is a modern real-time messaging platform with AI chat, channels, and seamless communication. Fast, secure, and user-friendly.",

  keywords: [
    "ChitChat",
    "chat app",
    "real-time messaging",
    "AI chat",
    "whatsapp alternative",
    "messaging app",
    "next.js chat app"
  ],

  authors: [{ name: "ChitChat Team" }],
  creator: "Salman khan",
  publisher: "ChitChat",

  applicationName: "ChitChat",

  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },

  openGraph: {
    title: "ChitChat – Real-time Messaging & AI Conversations",
    description:
      "Experience fast, secure, and intelligent messaging with ChitChat. Chat with friends, explore AI, and stay connected.",
    url: `${process.env.NEXT_PUBLIC_DEV_DOMAIN_URL}`,
    siteName: "ChitChat",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "ChitChat Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ChitChat – Messaging Redefined",
    description:
      "A modern chat platform with AI-powered conversations and real-time messaging.",
    images: ["/assets/logo.png"],
    creator: "@chitchat_app",
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "technology",

  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
   const { locale } = await params; // ✅ FIX

  const messages = (await import(`../../messages/${locale}.json`)).default;
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster
              position="top-center"
              richColors
              toastOptions={{
                className: "bluise-toast",
              }}
            />
          <BootstrapClient/>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        
        </AuthProvider>
      </body>
    </html>
  );
}
