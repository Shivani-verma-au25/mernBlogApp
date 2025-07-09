import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
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
import { BookMarked, Heart, MessageCircle, Share, Share2 } from "lucide-react";
import { toast } from "sonner";

function BlogDetail() {
  const { blogId } = useParams();
  const { blogs } = useSelector((state) => state.blog);
  console.log(blogs, "from details");

  const selectedBlog = blogs.find((blog) => blog._id === blogId);

  console.log("selected blog", selectedBlog);
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
            <Button variant='ghost' className='flex items-center gap-1'><Heart className="size-5 cursor-pointer hover:text-gray-600 text-white" />1</Button>
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
