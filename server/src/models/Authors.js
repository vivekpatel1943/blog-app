import mongoose from 'mongoose';

const AuthorSchema = mongoose.Schema({
    authorname : {
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    }, 
    password:{
        type:String,
        required:true
    }
})

export default mongoose.model("Authors",AuthorSchema,"author-collections");