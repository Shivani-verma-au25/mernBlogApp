import { Card } from '@/components/ui/card'
import React, { use, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInsatnce } from '@/utils/axios';
import { setLoading,setBlog} from '@/store/blogSlice';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';





function Yourblog() {
  const {loading ,blogs} = useSelector(state => state.blog)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const getWonBlogs = async () =>{ 
    dispatch(setLoading(true))
    try {
      const res = await axiosInsatnce.get('/blog/getownblogs')
      console.log("res" , res.data);
      if (res.data?.success) {
        dispatch(setBlog(res.data?.blogs))
      }
    } catch (error) {
      console.log("Error while fetching blogs",error);
      toast.error(error.response.data.message)
    }finally{
      dispatch(setLoading(false))
    }
  }

  const deleteBlog = async (blogId) =>{
    try {
      const res = await axiosInsatnce.delete(`/blog/deleteOwnBlog/${blogId}`)
      if (res.data.success) {
        let filteredBlogs = blogs.filter(blog => blog._id !== blogId)
        dispatch(setBlog(filteredBlogs))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log("error in delete ing blog",error);
      toast.error(error.response.data.message || "Something went wrong while deleting")
      
    }
  }

  useEffect(()=>{
     const controller = new AbortController();
    getWonBlogs()
    return () => {
      controller.abort();
    }
  },[])

  console.log("blogs from state" , blogs);

  if (loading) {
    <div className='text-4xl'>Loading....</div>
  }
  
  
  return (
    <div className='pb-10 mt-32 md:ml-[300px] h-screen' >
      <div className='max-w-6xl mx-auto mt-8'>
        <Card className='w-full p-5 space-y-2 dark:bg-gray-800' >
          <Table>
          <TableCaption>A list of your recent blogs.</TableCaption>
          <TableHeader>
            <TableRow >
              <TableHead >Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-start">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs && blogs.map((blog,index) => (
              <TableRow key={index}>
                <TableCell className="flex gap-4 items-center">
                  {
                    blog?.thumbnail? (
                      <>
                        <img src={blog.thumbnail} className='w-20 h-10 object-cover rounded-md hidden md:block' alt="" />
                        <h2 onClick={()=>navigate(`/dashboard/blogDetailPage/${blog._id}`)} className='hover:underline cursor-pointer'>{blog?.title}</h2>
                      </>
                    ):
                    <h1 className='text-xl font-bold'>There is no Picture! </h1>
                  }
                </TableCell>
                <TableCell>{blog.category}</TableCell>
                <TableCell>{new Date(blog.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-center">  
                <DropdownMenu >
                  <DropdownMenuTrigger><EllipsisVertical className='' /></DropdownMenuTrigger>
                  <DropdownMenuContent className=''>
                    <DropdownMenuItem
                    onClick={()=> navigate(`/dashboard/createblog/${blog._id}`)}
                     className='cursor-pointer'><Edit />Edit</DropdownMenuItem>
                    <DropdownMenuItem 
                    onClick={() => deleteBlog(blog._id)}
                    className='text-red-600 cursor-pointer' > <Trash  className='text-red-600' />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Card>
      </div>
    </div>
  )
}

export default Yourblog