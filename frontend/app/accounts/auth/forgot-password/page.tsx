import ForgotPassword from '@/components/accounts/forgot-password'
import React from 'react'

export const metadata = {
    title: 'Forgot Password | ChitChat',
    description: 'Securely reset your ChitChat password using email OTP verification.',
    keywords: ['Forgot Password', 'Reset Password', 'ChitChat'],
    
    icons: {
        icon: '/assets/logo.png',     
        shortcut: '/assets/logo.png',     
        apple: '/assets/logo.png',         
    },

    robots: {
        index: false,
        follow: false,
    },

    openGraph: {
        title: 'Forgot Password | ChitChat',
        description: 'Reset your password securely.',
        type: 'website',
    },
}

const page = () => {
  return <ForgotPassword/>
}

export default page