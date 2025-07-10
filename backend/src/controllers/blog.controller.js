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


// get all blogs 

// export const getAllBlogs = asyncHandler( async (req , res) => {
//     try {
//         const blogs = await Blog.find().populate('author','name email pictureUrl').sort({createdAt : -1});
//         if (!blogs || blogs.length === 0){
//             return res.status(404).json({
//                 success : false,
//                 message : "No blogs found!"
//             })
//         }
//         return res.status(200).json({
//             success : true,
//             message : 'Blogs fetched successfully!',
//             blogs
//         })


//     } catch (error) {
//         console.log("Error in get all blogs",error);
        
//         return res.status(500).json({
//             success: false,
//             message: "Failed to get Blogs!"
//         })
//     }
// })


// get all your own logs
export const getOwnBlogs = asyncHandler( async (req ,res) =>{
    try {
        const userId = req.user._id; // get user id from token
        if(!userId) {
            return res.status(400).json({
                success :false ,
                message : "User not found!"
            })
        }
        // find blogs by author id
        const blogs = await Blog.find({author: userId}).populate('author','firstname lastname  photoUrl').sort({createdAt : -1});
        if(!blogs || blogs.length === 0 ){
            return res.status(404).json({
                success : false,
                message : "No blogs found!",
                blogs : []
            })
        }
        return res.status(200).json({
            success : true,
            message : "your blogs fetched successfully!",
            blogs
        })

        
    } catch (error) {
        console.log("Error in get own blogs",error);
        return res.status(500).json({
            success : false,
            message : "Failed to get your blogs!"
        })
        
    }
})


// detele blog your won blog
export const deleteOwnBlog = asyncHandler(async (req,res) =>{
    try {
        const {id} = req.params; // get blog id
        if(!id){
            return res.status(400).json({
                success : false,
                message : "Blog id is Required!"
            })
        }     
        // find blog by id
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(404).json({
                success : false,
                message : "Blog not found!"
            })
        }   
        // check if the blog belongs to the user
        if(blog.author.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success : false,
                message: "You are not authorized to delete this blog!"
            })
        }
        // delete blog
        const deletedBlog = await Blog.findByIdAndDelete(id);

        return res.status(200).json({
            success : true,
            message : `${deletedBlog.title} deleted!`,
            deletedBlog
        })

    } catch (error) {
        console.log("Error in dalete own blog",error);
        return res.status(500).json({
            success:false,
            message : 'Failed to delete blog!'
        })
        
    }
})


// get published blogs 

export const getPublishedBlogs = asyncHandler (async (req,res) => {
    try {
        const blogs = await Blog.find({isPublished : true}).populate('author','firstname lastname photoUrl').sort({createdAt : -1});
        if(!blogs || blogs.length === 0){
            return res.status(404).json({
                success : false,
                message : "No publishe blog found!",
                blogs : []
            })
        }

        return res.status(200).json({
            success : true,
            message : "Published blogs fetched successfully!",
            blogs
        })
        
    } catch (error) {
        console.log("error in get published blog" ,error);
        return res.status(500).json({
            success: false,
            message : "Failed to get Published Blog!"
        })
        
    }
})


// toggle publish blog
export const togglePublishBlog = asyncHandler(async(req,res) =>{
    try {
        const {blogId} = req.params;
        const {isPublished} = req.query; // get isPublished from query params
        if(!blogId){
            return res.status(400).json({
                success : false,
                message : "Blog id is required!"
            })
        }
        // if(isPublished !== 'true' && isPublished !== 'false'){
        //     return res.status(400).json({
        //         success :false,
        //         message : "isPublished must be true or false!"
        //     })
        // }
        // find blog by id
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({
                success : false,
                message : "Blog not found!"
            })
        }
        // check if the blog belongs to the user
        // if(blog.author.toString() !== req.user._id.toString()){
        //     return res.status(403).json({
        //         success :false,
        //         message :"You are not authorized to update this blog!"
        //     })
        // }
        // toggle publish status
        blog.isPublished = !blog.isPublished; 
        const updatedBlog = await blog.save(); // save the updated blog
        return res.status(200).json({
            success : true,
            message : `Blog ${isPublished ? 'published' : 'unpublished'} `,
            updatedBlog
        })

        
    } catch (error) {
        console.log("error in toggle published blog" ,error);
        return res.status(500).json({
            success : false,
            message : "Failed to update status!"
        })
        
    }
})


// like blog

export const likeBlog = asyncHandler( async (req, res) => {
    try {
        const {blogId} =req.params; // get blog id from params
        if(!blogId){
            return res.status(400).json({
                success :false,
                message :"Blog id is required!"
            })
        }

        // find blog by id
        const blog = await Blog.findById(blogId).populate('likes');
        if(!blog){
            return res.status(404).json({
                success : false,
                message : "Blog not found!"
            })
        }
        // check if the blog is already liked by the user
        const isLiked = blog.likes.includes(req.user._id);


        if(isLiked){
            // if liked ,than remove the user from likes array
            blog.likes = blog.likes.filter(userId => userId.toString() !== req.user._id.toString());
            await blog.save();
            return res.status(200).json({
                success : true,
                message : "Blog unliked ",
                blog
            })
        }else{
            // if not liked ,than add the user to likes array
            blog.likes.push(req.user)._id;
            await blog.save();
            return res.status(200).json({
                success : true,
                message :"Blog liked",
                blog
            })
        }

    } catch (error) {
        console.log("Error in like blog",error);
        return res.status(500).json({
            success :false,
            message : "Failed to like blog!"
        })
        
    }
})

// check total likes of blogs

export const getTotatllikes = asyncHandler(async (req,res) =>{
    try {
        const {blogId} = req.params; // get blogs id
        if(!blogId){
            return res.status(400).json({
                success:false,
                message :"Blog id is required!"
            })
        }

        // find blog b
        const blog = await Blog.find({author : blogId}).select('likes');
        const totalLikes = blog.reduce((acc,blog)=> acc + (blog.likes?.length || 0) , 0);
        return res.status(200).json({
            success : true,
            message :blog.length,
            totalLikes
        }) 

        
    } catch (error) {
        console.log("Error in get total likes",error);
        return res.status(500).json({
            success :false,
            message :"Failed to get toatal likes!"
        })
        
    }
})