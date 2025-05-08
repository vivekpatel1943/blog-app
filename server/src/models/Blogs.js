import mongoose from 'mongoose';


const BlogSchema = new mongoose.Schema({
    // this is simply to identify the user who has written the blog with the id associated with the account
    AuthorId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Authors',
        required:true
    },
    heading : {
        type : String,
        required : true,
    },
    subHeading : {
        type :String,
    },
    mainContent : {
        type : String,
        required :true,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    LikedBy: {
        type: Array,
        deafault: []
    }
    // InteractionsId:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'interactions',
        
    // }
})

export default mongoose.model("Blogs",BlogSchema,'Blog-collections')