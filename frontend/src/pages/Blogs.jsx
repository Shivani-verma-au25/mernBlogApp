import React from 'react'
import { useSelector } from 'react-redux'

function Blogs() {
  const {blogs} = useSelector(state => state.blog)
  console.log("all blogs from blog",blogs);

  const publisheblog = blogs.find((blog) => blog.isPublished === true)
  console.log("publisheblog" ,publisheblog);
  
  
  return (
    <div className='pt-20'>
      <img src={publisheblog.thumbnail} alt="" />
    </div>
  )
}

export default Blogs