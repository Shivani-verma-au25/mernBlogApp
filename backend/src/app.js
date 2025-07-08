import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
dotenv.config()

const app = express()


app.use(cors({
    origin : ['http://localhost:5173'],
      credentials: true 
}))
app.use(express({urlencoded: true}))
app.use(express.json())
app.use(cookieParser())



// routes
import UserRouter from './routers/user.router.js'
import BlogRouter from './routers/blog.router.js'

app.use('/api/auth/user' , UserRouter)
app.use('/api/blog' , BlogRouter)


export {app}




