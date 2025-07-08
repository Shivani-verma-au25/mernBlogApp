import mongoose, { Mongoose,Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const userShecma = new Schema({
    firstname :{
        type: String,
        required : true
    },
    lastname :{
        type: String,
        required : true
    },
    email :{
        type: String,
        required : true,
        unique : true
    },
    password :{
        type: String,
        required : true
    },
    bio :{
        type: String,
        default : ''
    },
    occoupation :{
        type: String,
        default : ''
    },
    photoUrl :{
        type: String,
        default : ''
    },
    insta :{
        type: String,
        default : ''
    },
    linkedin :{
        type: String,
        default : ''
    },
    gitHub :{
        type: String,
        default : ''
    },
    faceBook :{
        type: String,
        default : ''
    },
} , {timestamps : true})


userShecma.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password =  await bcrypt.hash(this.password , 10)
    next()
})


userShecma.methods.isPasswordCorrect = async function (password){
    console.log("passwprd" ,password);
    
    return await bcrypt.compare(password , this.password);
}


userShecma.methods.generateAccessToken = async function (){
    return jwt.sign(
        {_id : this._id} , 
        process.env.ACCESS_TOKEN , 
        {expiresIn :  process.env.ACCESS_TOKEN_EXPIRY}
    )};

export const User = mongoose.model("User",userShecma)