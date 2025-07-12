import { axiosInsatnce } from '@/utils/axios';
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage } from './ui/avatar';

function PopularAuthothers() {
    const [populaerUser,setPopulaerUser] = useState([])
    const getallUsers =  async()=>{
        try {
            const res = await axiosInsatnce.get('/auth/user/allUsers')
            if (res.data.success) {
                setPopulaerUser(res.data.users)
            }
            
        } catch (error) {
            console.log("Error in getAll users",error);

            
        }
    }

    useEffect(() =>{
        getallUsers()
    },[])

    console.log("pu",populaerUser);
    
  return (
    <div>
        <div className='max-w-7xl mx-auto'>
            <div className='flex flex-col space-y-4 items-center'>
                <h1 className='text-3xl mdLtext-4xl font-bold pt-10'>Popular Author</h1>
                <hr  className='w-24 text-center border-2 border-red-500 rounded-full'/>
            </div>
            <div className='flex items-center justify-around my-10 md:px-0'>
                {
                    populaerUser?.slice(0,3)?.map((items) => (
                        <div key={items._id} className='flex  flex-col gap-2 items-center'>
                            <img src={items?.photoUrl || 'https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg='} alt="" className='rounded-full h-16 w-16 md:w-32 md:h-32' />
                            <p className='font-semibold pb-10'>{items.firstname} {items.lastname}</p>
                        </div>
                    )) 
                }
            </div>
        </div>
    </div>
  )
}

export default PopularAuthothers