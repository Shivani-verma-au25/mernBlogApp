import { setBlog } from '@/store/blogSlice';
import { axiosInsatnce } from '@/utils/axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BlogCardList from './BlogCardList';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';

function RecentBlogs() {
    const {blogs} = useSelector(state => state.blog)
    const dispatch = useDispatch()

    const getAllPublishedBlogs =async () => {
        try {
            const res = await axiosInsatnce.get('/blog/get-publishe-blog')
            if (res.data.success) {
                dispatch(setBlog(res.data.blogs))
            }
            
        } catch (error) {
            console.log("eerr",error);
            
        }
    }

    useEffect(()=>{
        getAllPublishedBlogs()
    },[])

    console.log("blog", blogs);
    
  return (
    <div className='bg-gray-100 dark:bg-gray-800 pb-10'>
        <div className='max-w-6xl mx-auto space-y-4 flex flex-col items-center'>
            <h1 className='text-4xl font-bold pt-10'>Recent Blogs</h1>
            <hr className='w-24 text-center border-2 border-red-50 rounded-full' />
        </div>
        <div className='max-w-7xl flex mx-auto gap-6'>
            <div className=''>
                <div className='mt-10 px-2 md:px-0'>
                    {
                        blogs?.slice(0,4)?.map((blog,index) => (<BlogCardList key={index} blog={blog} />))
                    }
                </div>
            </div>

            <div className='bg-white hidden md:block dark:bg-gray-700 w-[350px] p-5 rounded-md mt-10'>
                <h1 className='text-2xl font-semibold'>Popular categoreis</h1>
                <div className='my-5 flex flex-wrap gap-3' >
                    {
                        ["Blogging" ,'Web Development',"Digital marketing" , "Cooking ","Photography" ,"Sports"].map((items,index)=>(
                            <Badge className='cursor-pointer' key={index} >{items}</Badge>
                        ))
                    }
                </div>
                <h1 className='text-xl font-semibold'>Subscribe to  Newletter</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400' >Get the latest posts and updated deliverd Straight to your inbox </p>
                <div className='flex flex-col sm:flex-row gap-2 max-w-md mx-auto m-5'>
                    <Input
                    type='email'
                    placeholder ="Enter your email"
                    className='flex h-10 w-full rounded-md border bg-gray-200 dark:bg-gray-800 px-3 py-2 text-sm text-gray-300'
                    />
                    <Button>Subscribe</Button>
                </div>
                <div className='mt-7'>
                    <h2 className='text-xl font-semibold mb-3'>Suggested blogs</h2>
                    <ul className='space-y-3 flex flex-col'>
                        {
                            ["10 Tips to Master in react",
                                "UnderStanding Node.js",
                                "Learn about SEO"
                            ].map((items) => (
                                <Badge variant={'ghost'} className='cursor-pointer hover:underline' >{items}</Badge>
                            ))
                        }
                    </ul>
                </div>
            </div>

        </div>
    </div>
  )
}

export default RecentBlogs