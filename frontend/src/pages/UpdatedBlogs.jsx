import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef, useState } from 'react'
import JoditEditor from 'jodit-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/store/blogSlice'
import { axiosInsatnce } from '@/utils/axios'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'


function UpdatedBlogs() {
    const {blogId} = useParams()
    const {blogs,loading} = useSelector(state => state.blog)
    console.log("blog from satae" , blogs);
    const selectBlogs = blogs.find(blog => blog._id === blogId)
    
    const editor = useRef(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // console.log(blogId);
    const [content,setContent] = useState(selectBlogs?.description)
    
    const [previewThumbnail ,setPreviewThumbnail ] = useState(selectBlogs?.thumbnail)
    const [blogData ,setBlogData] = useState({
        title: selectBlogs?.title,
        subtitle : selectBlogs?.subtitle,
        description : selectBlogs?.content,
        category : selectBlogs?.category,

    })

    const [isPublished ,setIsPublished] = useState(false)

    const selectChange =  (value)=>{
        setBlogData({...blogData , category : value})
    }

    // thumbnail preview
    const prviewThumbnailfunc = (e) =>{
        const file = e.target.files?.[0]
        if (file) {
            setBlogData({...blogData , thumbnail : file})
            const fileReader  = new FileReader()
            fileReader.onloadend = ()=> setPreviewThumbnail(fileReader.result)
            fileReader.readAsDataURL(file)
        }
    }


    // update blog
    const updateBlogHandler = async() => {
        const formData = new FormData()
        formData.append('title' , blogData.title),
        formData.append('subtitle',blogData.subtitle),
        formData.append('description',blogData.description),
        formData.append('category',blogData.category),
        formData.append('file',blogData.thumbnail)

        try {
            dispatch(setLoading(true))
            const resp = await axiosInsatnce.put(`/blog/updateBlog/${blogId}`, formData ,{
                headers:{
                    "Content-Type" : 'multipart/form-data',
                },
                withCredentials: true
            } )


            if (resp.data.success ) {
                console.log("Blogdata" , resp.data); 
                toast.success(resp.data.message)
                navigate('/dashboard/yourblog')
            }

        } catch (error) {
            console.log("Error in update blog",error);
            
        }finally{
            dispatch(setLoading(false))
        }

    }


    // toggle  publishe unpulished

    const publisheAndUnpublished = async(action) => {
        try {
            const res = await axiosInsatnce.patch(`/blog/${selectBlogs._id}` ,{
                params : {
                    action
                }
            })

            if (res.data.success) {
                setIsPublished(!isPublished)
                toast.success(res.data.message)
                navigate('/dashboard/yourblog')
            }else{
                toast.error("Failed to update")
            }
        } catch (error) {
            console.log("eeror in published unpubished" , error);
            
        }
    }

    // delete blog todo : have to check 
    //  const deleteBlog = async (blogId) =>{
    //     try {
    //       const res = await axiosInsatnce.delete(`/blog/deleteOwnBlog/${blogId}`)
    //       if (res.data.success) {
    //         let filteredBlogs = blogs.filter(blog => blog._id !== blogId)
    //         dispatch(setBlog(filteredBlogs))
    //         toast.success(res.data.message)
    //         navigate('/dashboard/yourblog')
    //       }
    //     } catch (error) {
    //       console.log("error in delete ing blog",error);
    //       toast.error(error.response.data.message || "Something went wrong while deleting")
          
    //     }
    //   }


  return (
    <div className='md:ml-[320px] mt-20 px-3 pb-10'>
        <div className='max-w-6xl mx-auto mt-8'>
            <Card className='w-full bg-white dark:bg-gray-800 p-5 -space-y-2'>
                <h1 className='text-4xl font-bold'>Baisc Blog information</h1>
                <p>Make changes to your blogs here. Click here publish when you are done.</p>
                <div className='space-x-2'>
                    <Button 
                    onClick={() => publisheAndUnpublished(selectBlogs.isPublished ? 'false' : ' true')}
                    >{
                        selectBlogs?.isPublished ? 'UnPublish' : "Publish"
                    }</Button>
                    <Button  variant='destructive'>Remove Blog</Button>
                </div>
                <div className='pt-10 '>
                    <Label className='py-2'>Title</Label>
                    <Input 
                    type='text'
                    placeholder="Enter you title"
                    name='title'
                    className='dark:border-gray-300'
                    value={blogData.title}
                    onChange={ (e) => setBlogData({...blogData , title : e.target.value})}
                    />
                </div>
                <div className=' '>
                    <Label className='py-2'>Subtitle</Label>
                    <Input 
                    type='text'
                    placeholder="Enter you Subtitle"
                    name='subtitle'
                    className='dark:border-gray-300'
                    value={blogData.subtitle}
                    onChange={(e)=> setBlogData({...blogData , subtitle: e.target.value})}
                    />
                </div>
                <div className=' '>
                    <Label className='py-2'>Description</Label>
                    <JoditEditor 
                    ref={editor}
                    className='jodit-_toolbar'
                    value={blogData.description}
                    onChange={(newContent) => {
                        setContent(newContent);
                        setBlogData({ ...blogData, description: newContent });
                        }}
                    />
                </div>
                <div>
                <Label className='py-2'>Category</Label>
                <Select onValueChange={selectChange}  value={blogData.category}>
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
                <div>
                    <Label className='py-1'>Thumbnail</Label>
                    <Input
                    type='file'
                    id='file'
                    accept = 'image/*'
                    className='w-fit dark:border-gray-300'
                    onChange={prviewThumbnailfunc}
                    />
                    {
                        previewThumbnail && (
                            <img src={previewThumbnail} className='w-64 my-2' alt="blog thumbnail" />
                        ) 
                    }
                </div>
                <div className='flex gap-3'>
                    <Button variant='outline' onClick={()=> navigate(-1) } >Back</Button>
                    <Button onClick={updateBlogHandler} >{loading ?  <> <Loader className='w-5 h-5 animate-spin transition-all' /> Please wait</> : 'Save'}</Button>
                </div>
            </Card>
        </div>
    </div>
  )
}

export default UpdatedBlogs