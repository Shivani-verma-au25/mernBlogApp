import mongoose from 'mongoose'
import {Schema} from 'mongoose'

const blogShema = new Schema({
    title:{
        type : String,
        required : true
    },
    subtitle : {
        type : String,

    },
    description : {
        type : String
    },
    thumbnail : {
        type : String
    },
    author : {
        type: Schema.Types.ObjectId,
        ref : "User"
    },
    category: {
        type : String
    },
    likes : [
       { type : Schema.Types.ObjectId,
        ref : "User"
    }],
    comments : [
       { type : Schema.Types.ObjectId,
        ref : "Comment"
    }],
    isPublished : {
        type : Boolean,
        default : false
    },


} , {timestamps : true})


export const Blog = mongoose.model("Blog",blogShema)