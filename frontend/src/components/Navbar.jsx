import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { LogOut, MessageCircle, Moon, NotebookPen, NotebookTabs, Search, Sun, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { axiosInsatnce } from '@/utils/axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import {logout} from '../store/authSlice'
import { toggleTheme } from '@/store/themeBlog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { phantomjs } from 'globals'


function Navbar() {
  const dispatch = useDispatch()
  const user = useSelector( state => state.auth.user )
  const {theme} = useSelector( state => state.theme )
  
  
  const navigate = useNavigate()
  const logoutUser = async() =>{
    try {
      const res = await axiosInsatnce.post('/auth/user/logout')
      navigate('/login')
      dispatch(logout())
      toast.success(res?.data?.message)      
    } catch (error) {
      console.log("EEerror white logout user" , error.message);
      toast.error(error.response?.data?.message)
      
    }
  }
  return (
    <div className="py-4 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-600 bg-white border-2 z-50">
      <div className="max-w-7xl mx-auto flex  justify-between items-center px-4 md:px-0 ">
        {/* logo */}
        <div className="flex gap-7 items-center">
          <Link to={"/"}>
            <div className="flex gap-2 items-center ">
              <img
                className="w-7 h-7 md:w-10 md:h-10 dark:invert"
                src="https://img.icons8.com/?size=100&id=81252&format=png&color=000000"
                alt="Logo"
              />
              <h1 className="font-bold text-3xl md:text-4xl">Logo</h1>
            </div>
          </Link>
          <div className="relative hidden md:block ">
            <Input
              type="text"
              placeholder="Search"
              className="border-gray-700 dark:gb-gray-900 bg-gray-300 w-[300px] hidden md:block"
            />
            <Button className="absolute right-0 top-0 cursor-pointer">
              <Search />
            </Button>
          </div>
        </div>
        {/* nav */}
        <nav className="flex md:gap-7 gap-4 items-center">
          <ul className="hidden md:flex gap-7  items-center text-xl font-semibold">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/blogs"}>
              <li>Blogs</li>
            </Link>
            <Link to={"/about"}>
              <li>About</li>
            </Link>
          </ul>
          <div className="flex ">
            <Button
              onClick={() => dispatch(toggleTheme())}
              className="cursor-pointer"
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>
            {user ? (
              <div className="ml-5 flex gap-4 items-center rounded-full">
                    
                <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <Avatar>
                            <AvatarImage
                              className="w-full h-full  object-cover cursor-pointer"
                              src={ user?.photoUrl|| "https://img.freepik.com/free-vector/colorful-letter-gradient-logo-design_474888-2309.jpg?semt=ais_items_boosted&w=740"}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuGroup>
                          <DropdownMenuItem onClick= {() => navigate('/dashboard/profile')} > 
                            <User />
                            Profile
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick= {() => navigate('/dashboard/yourblog')} >
                            <NotebookTabs />
                            Your Blog
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick= {() => navigate('/dashboard/comments')} >
                            <MessageCircle />
                            Comments
                            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick= {() => navigate('/dashboard/createblog')} >
                            <NotebookPen />
                            Write Blog
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <LogOut />
                          Log out
                          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                 </DropdownMenu>
                <Link>
                  <Button type="submit" onClick={logoutUser}>
                    Logout
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="ml-7 md:flex gap-2">
                <Link to={"/login"}>
                  <Button>Login</Button>
                </Link>
                <Link className="hidden md:block" to={"/signup"}>
                  <Button>Signup </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar