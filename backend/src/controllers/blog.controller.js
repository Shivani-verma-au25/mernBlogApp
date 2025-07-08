import { asyncHandler } from '../../utils/asyncHandler.js';
import cloudinary from '../../utils/cloudinary.js';
import getDataUri from '../../utils/dataURI.js';
import { Blog } from '../models/blog.models.js';



export const createBlog = asyncHandler(async (req ,res) => {
    try {
        const {title , category} = req.body;
        
        if([title , category].some(field => field.trim() === ' ')){
            return res.status(400).json({
                success: false,
                message : "Title and categoy cnnont be empty!"
            })
        }
    
        const blog =  await Blog.create({
            title,category,author: req.user._id,
        })
    
        if (!blog) {
            return res.status(400).json({
                success : false,
                message : "Blog create being failed!"
            })
        }
        return res.status(201).json({
            success : true,
            message : "Blog creating successfully!",
            blog
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message  :"Failed to create blog!"
        })
    }
})


// update blog

export const updateBlog = asyncHandler( async( req, res) => {
    try {

        const {blogId} = req.params; // blog id
        const {title, subtitle , description, category} = req.body;
        const file = req.file;
        console.log("blog id", blogId);
        console.log("blog data", req.body);
        
        
        const blog = await Blog.findById(blogId);
        if (!blog) {
           return res.status(404).json({
            success :false,
            message : "Blog not found!"
           }) 
        }
        
        if (blog.author.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success : false,
                message : "you are not authorized to update this blog!"
            })
        }

        let thumbnail ;
        if(file){
            const fileUrl = await getDataUri(file)
            const cloudResponse = await cloudinary.uploader.upload(fileUrl);
            blog.thumbnail = cloudResponse.secure_url;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
                blogId, // just the ID here, NOT an object
                {
                    title: title || blog.title,
                    subtitle: subtitle || blog.subtitle,
                    description: description || blog.description,
                    category: category || blog.category,
                    thumbnail: thumbnail?.secure_url || blog.thumbnail,
                    author: req.user._id
                },
                { new: true } // return the updated document
        );

        if(!updatedBlog){
            return res.status(400).json({
                success : false,
                message : "Failed to update Blog!",
            })
        }

        return res.status(200).json({
            success:true,
            message : "Blog updated successfully!",
            updatedBlog
        })

    } catch (error) {
        console.log("Error in update blog" ,error);;
        return res.status(500).json({
            success :false ,
            message : "Failed to update blog!"
        })
        
    }
})