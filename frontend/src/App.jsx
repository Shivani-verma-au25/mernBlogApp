import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Blogs from './pages/Blogs';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { Toaster } from "@/components/ui/sonner";
import { useDispatch, useSelector } from 'react-redux';
import { axiosInsatnce } from './utils/axios';
import { logout, setLoading, setUser } from './store/authSlice';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Yourblog from './pages/Yourblog';
import Comments from './pages/Comments';
import CreateBlog from './pages/CreateBlog';
import { toast } from 'sonner';
import UpdatedBlogs from './pages/UpdatedBlogs';
import BlogDetail from './pages/BlogDetail';
import PageNotAvaibale from './pages/PageNotAvaibale';
import Footer from './components/Footer';

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
 useEffect(()=>{
  const checkAuth = async ()=>{
    try {
      const resp = await axiosInsatnce.get('auth/user/check',{withCredentials: true});
      // console.log("rs" ,resp.data.user);
      dispatch(setUser(resp.data.user)) // that means user still logged in 
      // toast.success(resp.data.message)
    } catch (error) {
      dispatch(logout()) ;  // token expired or cookie missing
      navigate('/login')
      console.log("error checking auth",error);
      // toast.error(error.response.data.message)
    }
  }
  checkAuth()
 },[])

  return (
    <div className=''>
      <Navbar />
      <Routes>
        <Route path='/' element={ <Home  />} />
        <Route path='/blogs' element={ <Blogs  />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login /> } />
        <Route path='/signup' element={<Signup /> } />
        <Route path='blogDetailPage/:blogId' element={<BlogDetail/>} />
        
        // nested routes 
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='profile' element={<Profile />} />
          <Route path='yourblog' element={<Yourblog />} />
          <Route path='comments' element={<Comments />} />
          <Route path='createblog' element={<CreateBlog />} />
          <Route path='createblog/:blogId' element={<UpdatedBlogs/>} />
        </Route>
        <Route path='*' element={ <PageNotAvaibale/> }/>
      </Routes>
      <Toaster />
       <Footer/>
    </div>
  );
}

export default App;
