import {Router} from "express"
import { getAllUsers, loginUser, logoutUser, registerUser, updateProfile } from "../controllers/user.controller.js";
import { protectedRoutes } from "../middlewares/auth.middleware.js";
import {singleUpload} from '../middlewares/multer.middleware.js'

const router = Router()


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/allUsers').get( getAllUsers)


// protected routes
router.route('/updateprofile').put(protectedRoutes ,singleUpload , updateProfile)
router.route('/check').get(protectedRoutes , (req,res) => {
    try {
        return res.status(200).json({
            success: true,
            message : 'User is authenticated',
            user : req.user,
        })
    } catch (error) {
        console.log("Error in check route" , error);
        return res.status(500).json({
            success: false,
            message : 'Internal server error"'
        })
        
    }
})



export default router;