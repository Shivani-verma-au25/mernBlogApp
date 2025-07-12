import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

function BlogCard({blog , key}) {
    const navigate = useNavigate()
  return (
    <div className='bg-white h-96 dark:bg-gray-800 dark:border-gray-600 p-6 rounded-2xl shadow-lg border hover:scale-105 transition-all  '>
        <img src={blog?.thumbnail} alt="Blog picture" className='rounded-lg w-full h-56 object-cover ' />
        <p className='text-sm py-1'>By {blog.author.firstname} | {blog.category} | {new Date(blog.createdAt).toLocaleDateString()}</p>
        <h2 className='text-xl font-semibold'>{blog.title}</h2>
        <h3 className='text-gray-500 text-sm'>{blog.subtitle}</h3>
        <Button 
        onClick={()=> navigate(`/blogDetailPage/${blog._id}`)}
        className='mt-2 text-xs cursor-pointer'>Read More...</Button>
    </div>
  )
}

export default BlogCard