import jwt from 'jsonwebtoken'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { User } from '../models/user.model.js';


export const protectedRoutes = asyncHandler(async (req , res, next) => {
    const token = req.cookies.blog || req.header("Authorization")?.replce("Bearer " ,"");
    console.log("token"  , token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message : "You are not authorized to access this resource. Please login first"
        })
    }

    // if token is there 
   try {
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN);
     if (!decodedToken || !decodedToken._id) {
        return res.status(400).json({
            success : false,
            message: "Invalid token !Please login again"
        })
    }

    const user = await User.findById(decodedToken._id).select('-password');
    if (!user) {
        return res.status(400).json({
            success: false,
            message : "User not found!"
        })
    }

    req.user = user;
    next()


   } catch (error) {
    console.log("Error in Protected routes",error);
     return res.status(500).json({
        success: false,
        message: "Internal server Error"
    });  
   }
     
})