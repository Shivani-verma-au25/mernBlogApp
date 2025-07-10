import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookMarked, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { axiosInsatnce } from "@/utils/axios";
import { setBlog } from "@/store/blogSlice";
import { FaHeart } from "react-icons/fa6";


function BlogDetail() {
  const { blogId } = useParams();
  const { blogs } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);
  const selectedBlog = blogs.find((blog) => blog._id === blogId);
  const [blogLike ,setBlogLike] = useState(selectedBlog.likes.length)
  const [liked ,setLiked] = useState(selectedBlog.likes.includes(user._id) || false)
  const dispatch = useDispatch()
  console.log("selected blog",selectedBlog);
  console.log("user ",user);
  
  


  // share blog
  const handleShare = (blogid) => {
    const blogUrl = `${window.location.origin}/blogs/${blogid}`
    if (navigator.share) {
      navigator.share({
        title:'Check out this blog!',
        text:'Read this amazing blog post',
        url:blogUrl,
      })
      .then(() => console.log("Shared successfully"))
      .catch((error)=> console.log("Error on sharing" ,error))
    }else{
      // fall back copy to clipboard
      navigator.clipboard.writeText(blogUrl)
      .then(()=>{
        toast.success("Blog  Link copied to clipboard")
      })
    }
  }

  //like or dislike handler 
  const likeAndDislikeHanlder = async () => {
  try {
    const res = await axiosInsatnce.get(`/blog/${selectedBlog._id}/like`); // ✅ always call /like

    if (res.data.success) {
      const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
      setBlogLike(updatedLikes);
      setLiked(!liked);

      // Update blog in redux
      const updatedBlogs = blogs.map((blog) =>
        blog._id === selectedBlog._id
          ? {
              ...blog,
              likes: liked
                ? blog.likes.filter((id) => id !== user._id)
                : [...blog.likes, user._id],
            }
          : blog
      );

      dispatch(setBlog(updatedBlogs));
      toast.success(res.data.message);
    }
  } catch (error) {
    console.log("Error in like and dislike", error);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};


  return (
    <div className="pt-14">
      <div className="max-w-6xl mx-auto p-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="">Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* blog header */}
        <div className="my-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{selectedBlog.title}</h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Avatar >
                <AvatarImage  src={selectedBlog.author?.photoUrl} alt='Author Pic' />
                <AvatarFallback>JN</AvatarFallback>
              </Avatar>
              <div className="flex gap-1 justify-center items-center">
                <p className="font-medium ">{selectedBlog.author.firstname} {selectedBlog.author.lastname}</p>
              
              </div>
            </div>
            {/* date */}
            <div className=" flex gap-2 ">
              <p className="text-sm text-muted-foreground">Published On{new Date(selectedBlog.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/*featured image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img  src={selectedBlog.thumbnail} alt="thumbnail" />
          <p className="font-medium py-2 italic md:text-xl text-muted-foreground ">{selectedBlog.subtitle}</p>
        </div>
        {/* details */}
        <div>
          <h1 className="text-4xl font-bold sm:text-6xl ">Introduction</h1>
          <p className="font-light" dangerouslySetInnerHTML={{__html : selectedBlog.description}}/>
        </div>
        {/* comment and like share */}
        <div className="flex items-center justify-between border-y darkborder-gray-800 border-gray-300 py-4 mb-8">
          <div className="flex items-center space-x-4 ">
            <Button onClick={likeAndDislikeHanlder} variant='ghost' className='flex items-center gap-1'>
              {
                liked ? <FaHeart className="size-5 cursor-pointer hover:text-gray-600 text-red-700" />
              :
              <FaHeart className="size-5 cursor-pointer hover:text-gray-600 text-white" />
              } 
              <span>{blogLike}</span>
              </Button>
            <Button variant='ghost' ><MessageCircle className="sixe-5"/>
            <span>1 comment</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant='ghost'>
              <BookMarked className="size-5" />
            </Button>
            <Button onClick={() => handleShare(selectedBlog._id)} variant='ghost'>
              <Share2 className="size-5"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
