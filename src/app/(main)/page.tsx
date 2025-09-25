import Auth from '@/components/auth'
// import { Navbar  } from '@/components/navbar'
import React from 'react'

const page = () => {
  return (
    <div
      className='relative  min-h-screen bg-background text-primary'
    >
      <Auth />
      <div
        className='min-h-screen'
      ></div>
    </div>
  )
}

export default page