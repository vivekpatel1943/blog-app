import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import Authors from './src/models/Authors.js';
import Blogs from './src/models/Blogs.js';
import Interactions from './src/models/Interactions.js';

import authRoutes from './src/routes/authRoutes.js';
import authMiddleware from './src/middlewares/authMiddleware.js';

// configuring all our environment variables
dotenv.config();

// connecting the server to the database
async function db_connection(){
    try{
        console.log(process.env.mongo_uri)
        await mongoose.connect(process.env.mongo_uri);
        console.log("connection to the database successfull..")
    }catch(err){
        console.error("connection to the database failed..",err,".")
    }
}

db_connection();

// initialising express
const app = express();

// all the middlewares
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true, //this allows cookies to be sent
}));

app.use(express.json()) //this middleware makes json data available as javascript object

// routes
// authentication-routes
app.use('/api/auth',authRoutes);
// cookie-parser
app.use(cookieParser());
// authMiddleware
// app.use(authMiddleware());

// we need our authMiddleware only in our post route, so when an author writes and posts a new blog it gets added to his account only,or somebody can't add posts to somebody else's accounts

// get all the blogs
app.get('/api/blogs',async (req,res) => {
    try{
        const blogs = await Blogs.find()
            .populate({
                path : 'InteractionsId',
                populate : [
                    {path : 'likedBy',select : 'authorname'},
                    {path : 'bookmarkedBy',select:'authorname'},
                    {path:'commentedBy.user',select:'authorname'}
                ]
            })
            .populate('AuthorId','authorname');

        console.log(blogs.map((blog) => blog.InteractionsId))
        res.status(200).send(blogs)
    }catch(err){
        res.status(500).json({msg:"internal server error.."})
    }  
})

// post a new blog
app.post('/api/blog',authMiddleware,async (req,res) => {

    try{

        const {heading,subHeading,mainContent,date} = req.body;

        // console.log(req.body)
        // we signed the id in the jwt with the key {AuthorId:Author._id}(refer to authRoutes.js)
        // and we saved it in the request body as req.author=AuthorId (ref: authMIddleware.js) 
        // this is how if we need to access the author-id we will access it as req.author.AuthorId

        // 1. create blog with InteractionsId
        const newBlog = new Blogs({
            AuthorId:req.author.AuthorId,
            heading:heading,
            subHeading:subHeading,
            mainContent:mainContent,
            date:date,
            InteractionsId:null,//temporarily null
        });

        const savedBlog = await newBlog.save();
        
        //2.  create Interaction doc for the blog
        const newInteraction = new Interactions({
            BlogId : savedBlog._id,
            likedBy : [],
            bookmarkedBy : [],
            commentedBy : []
        })

        const savedInteraction = await newInteraction.save();

        // 3. update blog with interaction id
        savedBlog.InteractionsId = savedInteraction._id;
        await savedBlog.save();

        res.status(200).json(savedBlog);
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Internal server error..",err});
    }
})

// get an individual-blog
app.get('/api/blog/:id',async(req,res) => {
    try{
        const blogId = req.params.id ;
        const blog = await Blogs.findById(blogId);
        if(!blog){
            res.status(404).json({msg:"blog not found.."})
        }
       
        res.status(200).send(blog)
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"internal server error.."})
    }
})

// update the blog change the headings,subheadings or the maincontent
app.patch('/api/blog/:id',authMiddleware,async (req,res) => {
    try{
        const blogId = req.params.id;
        console.log(blogId)
        const blog = await Blogs.findById(blogId);
        if(!blog){
            return res.status(404).json({msg:"blog not found.."})
        }
        console.log(blog)

        const {heading,subHeading,mainContent} = req.body;

        if(!heading && !subHeading && !mainContent){
            return res.status(400).json({msg: "please provide atleast one field value to update.."}) 
        }

        const newBlog = await Blogs.findByIdAndUpdate(blogId,{heading:heading,subHeading:subHeading,mainContent:mainContent})

        console.log(newBlog)

        await newBlog.save();

        res.status(200).send({newBlog}) 
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"internal server error.."})
    }
})

app.delete('/api/blog/:id/like',authMiddleware,async (req,res) => {
    try{
        const blogId = req.params.id;
        console.log(blogId)
        const blog = await Blogs.findById(blogId);
        console.log(blog)
        
        if(!blog){
            return res.status(404).json({msg:"blog not found..."})
        }

        await Blogs.findByIdAndDelete(blogId)

        res.status(200).json({msg:"blog deleted successfully.."})
    }catch(err){
        console.log(err)
        res.status(500).json({msg:"internal server error.."})
    }
})

// like a blog
app.post('/api/blog/:id/like',authMiddleware,async (req,res) => {
    const blogId = req.params.id;
    const blog = await Blogs.findById(blogId);
    const authorId = req.author.AuthorId;
    const author = await Authors.findById(authorId);

    try{
        const interaction = await Interactions.findOneAndUpdate(
            // with BlogId we identify which blog we have to make the changes to,  
            {BlogId : blogId},
            // $addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array
            {$addToSet : {likedBy : authorId}},
            // 'upsert' is a blend of 'update' and 'insert'. It denotes an operation in MongoDB that updates an existing document, or if the document doesn't exist, inserts a new one, and it automatically saves the updated document
            {new:true,upsert:true}
        ) 
        .populate('likedBy','authorname')
        .populate('bookmarkedBy','authorname')  
        .populate('commentedBy.user','authorname')

        res.status(200).json(interaction)
            
    }catch(err){
        console.error(err)
        res.status(500).json({msg:"internal server error.."})
    }
})

// bookmark a blog
app.post('/api/blog/:id/bookmark',authMiddleware,async (req,res) => {
    
    const blogId = req.params.id;
    const authorId = req.author.AuthorId;

    try{
        const interaction = await Interactions.findOneAndUpdate(
            // with the blogId we identify the blog we have to make the changes to,
            {BlogId :blogId},
            // $addToSet method adds a to an array unless the value is already present in the array, in which case the method does nothing to the array, it also saves the updated document automatically
            {$addToSet : {bookmarkedBy: authorId}},
            {new : true,upsert:true}
        ) 
        .populate('likedBy','authorname')
        .populate('bookmarkedBy','authorname')  
        .populate('commentedBy.user','authorname')

        res.status(200).json({interaction});
    }catch(err){
        res.status(200).json({msg:"internal server error.."})
    }
})

app.post('/api/blog/:id/comment',authMiddleware,async (req,res) => {
    const blogId = req.params.id;
    console.log(blogId)
    const authorId = req.author.AuthorId;
    console.log(authorId)
    const {commentText} = req.body

    try{
        const interaction = await Interactions.findOneAndUpdate(
            {BlogId: blogId},
            {
                // the push operator appends a specified value to an array
                $push : {
                    commentedBy : {
                        user : authorId,
                        commentText,
                        commentedOn : new Date()
                    }
                }
            },
            {new : true , upsert : true}
        )  
        .populate('likedBy','authorname')
        .populate('bookmarkedBy','authorname')  
        .populate('commentedBy.user','authorname')   
        res.status(200).json(interaction)
    }catch(err){
        res.status(500).json({msg:"internal server error.."})
    }
})

const port = process.env.port || 3000;

app.listen(port,() => {
    console.log(`your server is running on port ${port}.`);
})