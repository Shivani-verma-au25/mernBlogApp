import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Github, InstagramIcon, Linkedin, Loader } from "lucide-react";
import React, { useState  } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { axiosInsatnce } from "@/utils/axios";
import { setLoading, setUser } from "@/store/authSlice";
import { toast } from "sonner";

function Profile() {
  const {user ,loading} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [open ,setOpen] = useState(false)
  const [formData ,setFormData] = useState({
    firstname : user?.firstname,
    lastname : user?.lastname ,
    email : user?.email,
    bio : user?.bio,
    occoupation : user?.occoupation,
    file : null,
    insta : user?.insta,
    linkedin : user?.linkedin,
    gitHub : user?.gitHub,
    faceBook  :user?.faceBook,

  })

  const handleUpdateProfileSubmit = async (e)=>{
    e.preventDefault()
      const newFormData = new FormData()
      newFormData.append("firstname" ,formData.firstname)
      newFormData.append("lastname" ,formData.lastname)
      newFormData.append("email" ,formData.email)
      newFormData.append("bio" ,formData.bio)
      newFormData.append("occoupation" ,formData.occoupation)
      newFormData.append("insta" ,formData.insta)
      newFormData.append("linkedin" ,formData.linkedin)
      newFormData.append("gitHub" ,formData.gitHub)
      newFormData.append("faceBook" ,formData.faceBook)

      if (formData.file instanceof File) {
          newFormData.append("file", formData.file);
      }
    try {
      dispatch(setLoading(true))
      const res = await axiosInsatnce.put('/auth/user/updateprofile',newFormData , {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials : true
      })

      if (res.data.success) {
        setOpen(false)
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
      
    } catch (error) {
        console.error("Error updating profile", error);
        toast.error(error?.response?.data?.message || "Something went wrong");
    }finally{
      dispatch(setLoading(false))
    }
    
  } 

  if (loading) {
    <div>Loading....</div>
  }
   console.log("fomrdata" ,formData);
   
  return (
    <div className="pt-20 md:ml-[350px] md:h-screen">
      <div className="max-w-6xl mt-8">
        <Card className="flex md:flex-row flex-col gap-10 p-6 md:p-10 dark:bg-gray-800 mx-4 md:mx-0">
          {/* imgae section */}
          <div className="flex  flex-col items-center justify-center md:w-[400px]">
            <Avatar className="w-40 h-40 border-2">
              <AvatarImage
                className="w-full h-full object-cover"
                src= { user.photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"}
              />
            </Avatar>
            <h1 className="text-center font-semibold text-xl text-gray-700 dark:text-gray-300 ml-3 py-2">
              {user.occoupation || "Not mentioned"}
            </h1>
            <div className="flex gap-4 items-center ">
              <Link to={user.Facebook}>
                {" "}
                <Facebook className="w-6 h-6 text-gray-800 dark:text-gray-300" />{" "}
              </Link>
              <Link to={user.insta}>
                {" "}
                <InstagramIcon className="w-6 h-6 text-gray-800 dark:text-gray-300" />{" "}
              </Link>
              <Link to={user.linkdin}>
                {" "}
                <Linkedin className="w-6 h-6 text-gray-800 dark:text-gray-300" />{" "}
              </Link>
              <Link to={user.gitHub}>
                {" "}
                <Github className="w-6 h-6 text-gray-800 dark:text-gray-300" />{" "}
              </Link>
            </div>
          </div>
          {/* info section */}
          <div className="">
            <h1 className="font-bold text-center md:text-start text-4xl mb-7">
              Welcome {user.firstname || 'User'}
            </h1>
            <p className="">
              <span className="font-semibold">Email : </span>{user?.email}
            </p>
            <div className="flex flex-col gap-2 items-start justify-start my-5">
              <Label>About Me </Label>
              <p className="border dark:border-gray-600 p-6 rounded-lg">
              
                {" "}
                {user.bio ||"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita, aliquid." }
               {" "}
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                  <Button onClick={()=> setOpen(true)} variant="outline" className="cursor-pointer">
                    Edit Profile
                  </Button>
                <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleUpdateProfileSubmit}> 
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="flex gap-2 ">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">First Name</Label>
                        <Input
                          id="name-1"
                          name="firstname"
                          placeholder ="First Name"
                          type ="text"
                          onChange={(e) => setFormData({...formData , firstname : e.target.value})}
                          value={formData.firstname}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Last Name</Label>
                        <Input
                          id="username-1"
                          name="username"
                          placeholder ="Last Name"
                          type='text'
                          value={formData.lastname}
                          onChange = {(e) => setFormData({...formData, lastname : e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 ">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">FaceBook</Label>
                        <Input
                          id="name-1"
                          name=""
                          placeholder ="Enter url"
                          type ="text"
                          value={formData.faceBook}
                          onChange = {(e) => setFormData({...formData, faceBook : e.target.value})}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Instagram</Label>
                        <Input
                          id="username-1"
                          name=""
                          placeholder ="Enter url"
                          type='text'
                          value={formData.insta}
                          onChange = {(e) => setFormData({...formData, insta : e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 ">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Linkedin</Label>
                        <Input
                          id="name-1"
                          name=""
                          placeholder ="Enter url"
                          type ="text"
                          value={formData.linkedin}
                          onChange = {(e) => setFormData({...formData, linkedin : e.target.value})}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">GitHub</Label>
                        <Input
                          id="username-1"
                          name=""
                          placeholder ="Enter url"
                          type='text'
                           value={formData.gitHub}
                          onChange = {(e) => setFormData({...formData, gitHub : e.target.value})}
                          
                        />
                      </div>
                    </div>
                  
                  <div className="flex gap-2 py-3">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Occoupation</Label>
                        <Input
                          id="name-1"
                          name=""
                          placeholder ="Enter url"
                          type ="text"
                          value={formData.occoupation}
                          onChange = {(e) => setFormData({...formData, occoupation : e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className='text-right mb-2'>Picture</Label>
                      <Input 
                      id='file'
                      type='file'
                      accept='image/*'
                      className='w-[277px]'
                      name=''
                      onChange = {(e) => setFormData({...formData, file : e.target.files?.[0]})}
                      />
                      </div>
                    </div>
                  </div>

                      <div className="grid gap-3 py-5">
                        <Label htmlFor="name-1">Description</Label>
                        <textarea 
                        className="border dark:border-gray-300 border-gray-300 rounded-xl px-2 "
                        name="bio" 
                        id="" 
                        rows={4} 
                        cols={3} 
                        placeholder="Enter Description"
                         value={formData.bio}
                          onChange = {(e) => setFormData({...formData, bio : e.target.value})}
                        />
                      </div>
                     
                      
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit"  >{ loading  ? <Loader className="transition-all animate-spin " /> : 'Save changes'}</Button>
                  </DialogFooter>
              </form>
            </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
