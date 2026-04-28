import AppLayout from '@/components/MainApp/app-layout'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: {
      default: "ChitChat – Real-time Messaging & AI Chat",
      template: "%s | ChitChat",
    },
    description:
      "ChitChat is a modern real-time messaging platform with AI chat, status updates, channels, and seamless communication experience.",
      
    keywords: [
      "ChitChat",
      "chat app",
      "real-time messaging",
      "AI chat",
      "whatsapp clone",
      "online chat",
      "messaging platform",
      "student communication",
    ],

    authors: [{ name: "ChitChat Team" }],
    creator: "ChitChat",
    publisher: "ChitChat",

    metadataBase: new URL("https://your-domain.com"),

    openGraph: {
      title: "ChitChat – Real-time Messaging & AI Chat",
      description:
        "Connect instantly with friends, explore AI chat, and manage conversations with ChitChat.",
      url: "https://your-domain.com",
      siteName: "ChitChat",
      images: [
        {
          url: "/assets/logo.png",
          width: 1200,
          height: 630,
          alt: "ChitChat App",
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: "ChitChat – Real-time Messaging & AI Chat",
      description:
        "Smart, fast, and modern chat platform with AI-powered conversations.",
      images: ["/assets/logo.png"],
    },

    icons: {
      icon: "/assets/logo.png",
      shortcut: "/assets/logo.png",
      apple: "/assets/logo.png",
    },

    robots: {
      index: true,
      follow: true,
    },

    // themeColor: "#60A5FA",
};

const page = () => {
  return (
    <AppLayout/>
  )
}

export default page