import React from 'react'
import dynamic from 'next/dynamic'

const Login = dynamic(()=>import('@/components/auth/login'))

const page = () => {
  return (
    <Login/>
  )
}

export default page
