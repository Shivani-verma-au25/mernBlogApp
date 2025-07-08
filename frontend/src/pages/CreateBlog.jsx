import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { axiosInsatnce } from '@/utils/axios'
import { setBlog, setLoading } from '@/store/blogSlice'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'


function CreateBlog() {
  const [formData ,setFormData] = useState({
    title : '',
    category : ''
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {blogs=[] ,loading} = useSelector(state => state.blog || {})
  console.log("blogs" , blogs , loading);
  


  const createBlogHandle = async(e) =>{
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const res = await axiosInsatnce.post('/blog/create', formData);
      console.log("res",res);
      
      if (res.data.success) {
        if (!blogs) {
          dispatch(setBlog([res.data.blog]))
          toast.success(res.data.message)
        }
        let newBlog = [...blogs, res.data?.blog]
        dispatch(setBlog(newBlog)); // blogs must be array
        navigate(`/dashboard/createblog/${res.data?.blog._id}`);
        toast.success(res.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log("Error in blog create", error);
    } finally {
      dispatch(setLoading(false)); // ✅ Only this
    }
};


  // select category
  const getSelectedCategory = (value)=>{
    setFormData({...formData, category:value})
  }

  return (
    <div  className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20' >
      <Card className='md:p-10 p-4 dark:bg-gray-800'>
        <h1 className='text-2xl font-bold' > Let's Create blogs</h1>
        <p className=''> Lorem ipsum dolor sit amet consectetur adipisicing elit. At, quo. </p>
        <div className='mt-3'>
          {/* <form action=""> */}

          <div>
            <Label className='py-2'>Title</Label>
            <Input
            type='text'
            placeholder ="Your blog Name"
            className='bg-white dark:bg-gray-700'
            value={formData.title}
            onChange={(e) => setFormData({...formData, title : e.target.value})}
            />
          </div>
          <div>
              <Label className='py-2'>Category</Label>
              <Select onValueChange={getSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className='text-xl font-semibold text-black'>Category</SelectLabel>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="Blogging">Blogging</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Cooking">Cooking</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
          </div>
            <div className='flex gap-3 my-6'>
              <Button disabled={loading} onClick={createBlogHandle} type='submit' className=' cursor-pointer'>{loading ? <><Loader className='transition-all animate-spin' />Please wait </> : 'Create'}</Button>
            </div>
          {/* </form> */}
        </div>
      </Card>
    </div>
  )
}

export default CreateBlog