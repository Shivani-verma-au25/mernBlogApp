import BlogCard from '@/components/BlogCard'
import { setBlog } from '@/store/blogSlice'
import { axiosInsatnce } from '@/utils/axios'
import React, { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Blogs() {
  const {blogs} = useSelector(state => state.blog)
  const dispatch = useDispatch()
  // console.log("blogs" ,blogs);

  
  const getAllPublishedBlog = async() =>{
    try {

      const res = await axiosInsatnce.get('/blog/get-publishe-blog')
      console.log("res from " ,res.data.blogs);
      if (res.data.success) {
        dispatch(setBlog(res.data.blogs))
      }
    } catch (error) {
      console.log("erron get all published blog in blog page",error);
    }
  }

  useEffect(() => {
    getAllPublishedBlog()
  },[])
  

  
  
  return (
    <div className='pt-20 h-screen '>
      <div className=' max-w-6xl mx-auto text-center flex flex-col space-y-4 items-center '>
        <h1 className='text-4xl font-bold text-center pt-10' >Our Blog</h1>
        <hr className='w-24 text-center border-2 border-red-500 rounded-full'/>
      </div>
      <div className='max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-3  py-10 px-4 md:px-0'>
        {
          blogs.length >0 ? (
            blogs.map((blog) => (<BlogCard blog={blog} key={blog._id} />))
          ) : <h1 className='text-4xl text-gray-800'>There is no  blogs </h1>
        }
      </div>
    </div>
  )
}

export default Blogs