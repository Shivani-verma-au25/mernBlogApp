import {asyncHandler} from "../../utils/asyncHandler.js"
import cloudinary from "../../utils/cloudinary.js";
import getDataUri from "../../utils/dataURI.js";
import {User} from '../models/user.model.js'

// register user
export const registerUser = asyncHandler( async ( req , res) => {
    try {
        const {firstname ,lastname ,email,password} = req.body;
        if ([firstname,lastname,email,password].some((field) => field.trim() === "")) {
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        // checkt email is valid

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message : 'Invalid Email'
            })
        }

        // check password 
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message : "Password should be atleast 6 characters long"
            })
        }

        // if user is already exist

        const existUser = await User.findOne({email}).select('-password')
        if (existUser) {
            return res.status(401).json({
                success: false,
                message: "User is Aleady exist"
            })
        }

        // create user
        const user = await User.create({
            firstname,
            lastname,
            email,
            password,
        })

        const newUser = await User.find({email:user.email}).select('-password')
        if (!newUser) {
            return res.status(402).json({
                success : false,
                message : "User is not created!"
            })
        }

        return res.status(200).json({
            success : true,
            message : "User Created successfully",
            newUser
        })
        
    } catch (error) {
        console.log("Error registering user " , error);
        return res.status(500).json({
            success : false,
            message : "Failed to Register"
        })
        
    }
})


// login user

export const loginUser = asyncHandler( async ( req , res) => {
    try {
        const {email ,password} = req.body;
        

         if ([email , password].some((field) => field.trim() === '')){
            return res.status(400).json({
                success : false,
                message : "All fields are required !"
            })
        }

        // check user is registred or not 
        const existUser = await User.findOne({email})
        if (!existUser) {
            return res.status(401).json({
                success : false,
                message : "User not Found! Please register first"
            })
        }

        // check password is valid or not

        const validPassword = await existUser.isPasswordCorrect(password)
        
        if(!validPassword) {
            return res.status(402).json({
                success: false ,
                message : "Invailid credentials"
            })
        }

        // generate accessToken
        const accessToken = await existUser.generateAccessToken()

        return res.status(200)
        .cookie('blog' , accessToken ,{
            httpOnly:true,
            secure : false
        })
        .json({
            success : true,
            message : `Welcome back ${existUser.firstname}`,
            existUser
        })

        
    } catch (error) {
        console.log("Error accoured whike login user" , error);
        return res.status(500).json({
            success: false,
            message : "failed to login"
        })
        
    }
})


// logout user

export const logoutUser = asyncHandler( async ( req ,res  ) => {
    try {
        res.clearCookie('blog', {
            httpOnly: true,
            secure: true
        })

        return res.status(200).json({
            success : true,
            message : "User logged out!"
        })
    } catch (error) {
        console.log("Error while logging out user!");
        
    }
}) 


// update profile

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstname, lastname, bio, occoupation, insta, linkedin, gitHub, faceBook } = req.body;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // ✅ Only attempt upload if a valid file is provided
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.photoUrl = cloudResponse.secure_url;
    }

    // ✅ Assign fields (even empty string if user cleared it)
    user.firstname = firstname ?? user.firstname;
    user.lastname = lastname ?? user.lastname;
    user.occoupation = occoupation ?? user.occoupation;
    user.insta = insta ?? user.insta;
    user.faceBook = faceBook ?? user.faceBook;
    user.linkedin = linkedin ?? user.linkedin;
    user.gitHub = gitHub ?? user.gitHub;
    user.bio = bio ?? user.bio;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.log("error uploading file", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

