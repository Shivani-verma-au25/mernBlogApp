import {Router} from 'express'
import { protectedRoutes } from '../middlewares/auth.middleware.js';
import { createBlog, deleteOwnBlog, getOwnBlogs, getPublishedBlogs, getTotatllikes, likeBlog, togglePublishBlog, updateBlog } from '../controllers/blog.controller.js';
import { singleUpload } from '../middlewares/multer.middleware.js';

const router = Router()


router.route('/create').post(protectedRoutes , createBlog);
router.route('/updateBlog/:blogId').put(protectedRoutes , singleUpload , updateBlog);
router.route('/getownblogs').get(protectedRoutes  , getOwnBlogs);
router.route('/deleteOwnBlog/:id').delete(protectedRoutes  , deleteOwnBlog);
router.route('/:blogId/like').get(protectedRoutes, likeBlog);
router.route('/myblogs/likes').get(protectedRoutes  ,getTotatllikes);
router.route('/get-publishe-blog').get(protectedRoutes  ,getPublishedBlogs);
router.route('/:blogId').patch(togglePublishBlog);



export default router;