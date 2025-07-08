import React, { useState } from 'react'
import signup from '../assets/signup.jpg'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { axiosInsatnce } from '@/utils/axios'
import { useDispatch } from 'react-redux'
import { setUser } from '@/store/authSlice'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
    const [isOpenPass ,setIsOpenPass] = useState(false)
    const [fomData ,setFormData] = useState({
      email : '',
      password : ''
    })

    const handleSubmit =  async(e) => {
      e.preventDefault()
      try {
        const resp = await axiosInsatnce.post('/auth/user/login',fomData)
        console.log("res" , resp);
        if (resp?.data?.success === true) {
          navigate('/')
          console.log("User data from response:", resp.data?.existUser);
          dispatch(setUser(resp.data?.existUser))
          toast.success(resp?.data?.message)
        }

        setFormData({
          email : '',
          password : ''
        })

        
      } catch (error) {
        console.log("Error while login in login page",error.message);
        toast.error(error.response?.data?.message)
        
      }
    }
  
  return (
     <div className='flex h-screen md:pt-14 md:h-[760px]'>
      <div className='hodden md:block hidden'>
        <img 
        className='h-[700px] md:hidden lg:block lg:w-[500px] lg:h-[600px] lg:mt-6 xl:mt-0 xl:h-[700px] xl:w-[700px]'
        src={signup} alt="" />
      </div>
      {/* form */}
      <div className='flex justify-center items-center flex-1 px-4 md:px-0 '>
        <Card className='w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800  border-gray-600'>
          <CardHeader className=''>
            <CardTitle>
              <h1 className='text-center text-xl font-semibold'>Sign in to your Account</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className='space-y-4' onSubmit={handleSubmit} >
              
              {/* email */}
              <div>
                <div className=''>
                  <Label className='py-2'>Email</Label>
                  <Input 
                  type='email'
                  placeholder = "xyz@gamil.com"
                  name="email"
                  onChange = {(e) => setFormData( {...fomData , email: e.target.value})}
                  value={fomData.email}
                  className='dark:border-gray-600 dark:bg-gray-900 '

                  />
                </div>
              </div>
              {/* password */}
              <div>
                <div className='py-2 relative'>
                  <Label className='py-2'>Password</Label>
                  <Input 
                  type={isOpenPass ?'text' :  "password" }
                  placeholder ='.......'
                  name="password"
                  className='dark:border-gray-600 dark:bg-gray-900 '
                  onChange ={(e) => setFormData({...fomData , password: e.target.value})}
                  value={fomData.password}
                  />
                  <button 
                  onClick={() => setIsOpenPass(!isOpenPass)}
                  type='button' className='absolute right-3 top-11 text-gray-500'>{isOpenPass ? <Eye size={20}/> :  <EyeOff size={20}  /> }</button>
                </div>
              </div>
              <Button type='submit' className='w-full'>Sign In</Button>
              <p className='text-center text-gray-500'>Don't have an account ? <Link className='underline  font-semibold cursor-pointer hover:text-gray-800 dark:hover:text-gray-100 ' to={'/signup'}>Sign up</Link></p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login