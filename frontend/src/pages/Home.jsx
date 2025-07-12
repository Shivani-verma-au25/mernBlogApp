import React from 'react'
import Hero from '../components/Hero'
import RecentBlogs from '@/components/RecentBlogs'
import PopularAuthothers from '@/components/PopularAuthothers'
import Footer from '@/components/Footer'

function Home() {
  return (
    <div className='pt-20'>
      <Hero />
      <RecentBlogs />
      <PopularAuthothers/>
     
    </div>
  )
}

export default Home