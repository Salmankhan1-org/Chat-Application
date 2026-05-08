import Signup from '@/components/accounts/signup'
import AuthHeader from '@/components/auth-header';
import React from 'react'


export const metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_DEV_DOMAIN_URL}`),

  title: "Sign Up | ChitChat",
  description:
    "Create a new ChitChat account to start chatting, sharing files, and joining groups.",

  openGraph: {
    title: "Sign Up | ChitChat",
    description:
      "Create a new ChitChat account to start chatting, sharing files, and joining groups.",
    url: `${process.env.NEXT_PUBLIC_DEV_DOMAIN_URL}/accounts/auth/signup`,
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
    title: "Sign Up | ChitChat",
    description:
      "Create a new ChitChat account to start chatting, sharing files, and joining groups.",
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
    <Signup/>
    </>
  )
}

export default page