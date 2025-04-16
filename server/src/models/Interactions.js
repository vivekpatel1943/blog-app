import mongoose, { Mongoose } from 'mongoose';

/* 
    we are simply saving the interactions of the users with a certain blog , the structure keeps the blog at the center and whenever a user likes a blog-post or comments to a blog-post or bookmarks a blog-post , we push them in our likedBy-array or bookmarkedBy-array or commented-By array

    *note : notice that likedBy bookmarkedBy and commentedBy are arrays
*/

const InteractionSchema = new mongoose.Schema({

    // this is to identify the blog which is being liked, we identify the blogs with an unique automatically generated id
    BlogId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blogs",
        required:true,
    },
    likedBy : [{
        // to identify the author who has liked the post
        type : mongoose.Schema.Types.ObjectId,
        ref:"Authors",
    }],
    bookmarkedBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Authors"
    }],
    commentedBy:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Authors"
        },
        commentText:{
            type:String,
            required:true,
        },
        commentedAt:{
            type:Date,
            default:new Date(),
        }
    }]
}) 

export default mongoose.model('interactions',InteractionSchema,'interaction-collections')

