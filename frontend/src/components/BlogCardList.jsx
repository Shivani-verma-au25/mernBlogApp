import React from 'react'
import { Button } from './ui/button'

function BlogCardList({blog}) {
  return (
    <div className='bg-white dark:bg-gray-700 dark:border-gray-600 flex flex-col md:flex-row md:gap-4 p-5 rounded-2xl mt-2 shadow-lg border transition-all'>
        <div>
            <img src={blog.thumbnail} alt="" className='rounded-lg md:w-[300px] hover:scale-105 transition-all' />
        </div>
        <div className=''>
            <h1 className='text-2xl mt-3 md:mt-2 font-semibold'>{blog.title}</h1>
            <h3 className='text-gray-500 mt-1'>{blog.subtitle}</h3>
            <Button 
            onClick={()=> navigate(`/blogDetailPage/${blog._id}`)}
            className='mt-2 text-xs cursor-pointer'>Read More...</Button>
        </div>
    </div>
  )
}

export default BlogCardList