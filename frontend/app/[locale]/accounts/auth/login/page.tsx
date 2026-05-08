import AuthHeader from '@/components/auth-header';
import dynamic from 'next/dynamic'
import React from 'react'

const  Login = dynamic(()=>import('@/components/accounts/login'));


export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_DEV_DOMAIN_URL}`), 

  title: "Login | ChitChat",
  description:
    "Sign in to your ChitChat account to access real-time messaging, file sharing, and seamless conversations.",

  keywords: [
    "chat app login",
    "ChitChat login",
    "messaging app",
    "real-time chat",
    "secure login chat"
  ],

  authors: [{ name: "ChitChat Team" }],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Login | ChitChat",
    description:
      "Sign in to your ChitChat account and continue chatting, sharing files, and connecting instantly.",
    url: `${process.env.NEXT_PUBLIC_DEV_DOMAIN_URL}/accounts/auth/login`,
    siteName: "ChitChat",
    type: "website",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "ChitChat Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Login | ChitChat",
    description:
      "Access your ChitChat account and enjoy fast, secure messaging.",
    images: ["/assets/logo.png"],
  },

  icons: {
    icon: "/assets/logo.png",
  },
};

const page = () => {
  return (
    <>
    <AuthHeader/>
    <Login/>
    </>
  )
}

export default page