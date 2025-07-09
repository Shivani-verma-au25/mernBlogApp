import {Router} from 'express'
import { protectedRoutes } from '../middlewares/auth.middleware.js';
import { createBlog, deleteOwnBlog, getOwnBlogs, updateBlog } from '../controllers/blog.controller.js';
import { singleUpload } from '../middlewares/multer.middleware.js';

const router = Router()


router.route('/create').post(protectedRoutes , createBlog);
router.route('/updateBlog/:blogId').put(protectedRoutes , singleUpload , updateBlog);
router.route('/getownblogs').get(protectedRoutes  , getOwnBlogs);
router.route('/deleteOwnBlog/:id').delete(protectedRoutes  , deleteOwnBlog);



export default router;