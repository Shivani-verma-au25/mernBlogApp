import React from 'react'
import { useParams } from 'react-router-dom'

function BlogDetail() {
    const {blogId} = useParams()
    console.log(blogId);
    
  return (
    <div className='ml-[320px]  mt-32' >{blogId}</div>
  )
}

export default BlogDetail