import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import Authors from './src/models/Authors.js';
import Blogs from './src/models/Blogs.js';
// import Interactions from './src/models/Interactions.js';

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
app.use(express.urlencoded({ extended: true }));

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
        const blogs = await Blogs.find().populate('commentBy.user','authorname').populate('AuthorId','authorname')
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
        // this is how if we need to access the author-id we will access it as req.author.AuthorId as it is saved in the request object

        // 1. create blog with InteractionsId
        const newBlog = new Blogs({
            AuthorId:req.author.AuthorId,
            heading:heading,
            subHeading:subHeading,
            mainContent:mainContent,
            date:date,
            likedBy:[],//temporarily null
            bookmarkedBy:[],
            commentedBy:[],
        });

        const savedBlog = await newBlog.save();
        
        //2.  create Interaction doc for the blog
        // const newInteraction = new Interactions({
        //     BlogId : savedBlog._id,
        //     likedBy : [],
        //     bookmarkedBy : [],
        //     commentedBy : []
        // })

        // const savedInteraction = await newInteraction.save();

        // 3. update blog with interaction id
        // savedBlog.InteractionsId = savedInteraction._id;
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
        const blog = await Blogs.findById(blogId).populate('AuthorId','authorname');
        if(!blog){
            return res.status(404).json({msg:"blog not found.."})
        }
        res.status(200).send(blog)
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"internal server error.."})
    }
})

// see the profile of an individual author all his posts and all,
app.get('/api/profile',authMiddleware,async (req,res) => {
    console.log(req.author)
    try{
        const author = await Authors.findById(req.author.AuthorId);
        console.log("author logged-in",author)

        // retrieving all the blogs written by the author
        console.log("author id of the dude who is logged-in",author._id)
        // this is very important to use this syntax as this syntax assumes that the Blogs schema has a field like {AuthorId : {type = mongoose.Schema.types.ObjectId,ref:Authors}}
        // whereas something like Blogs.find(author._id) look for a blog object with id author._id,
        const blogs = await Blogs.find({AuthorId:author._id})
        console.log(blogs)

        if(!author){
            return res.status(400).json({msg:"bad request error.."})
        }

        if(!blogs){
            return res.status(404).json({msg:"author has not written any blogs whatsoever.."})
        }

        // we will send the author data to the frontend as json
        res.status(200).json({author,blogs})
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

        const newBlog = await Blogs.findByIdAndUpdate(blogId,{heading:heading,subHeading:subHeading,mainContent:mainContent},{new:true})

        console.log(newBlog)

        await newBlog.save();

        res.status(200).send({newBlog}) 
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"internal server error.."})
    }
})

// delete a blog-post
app.delete('/api/blog/:id',authMiddleware,async (req,res) => {
    const blogId = req.params.id;
    console.log(blogId)
    const blog = await Blogs.findById(blogId);
    console.log(blog)
    
    try{

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

    try{

        const blogId = req.params.id;
        const blog = await Blogs.findById(blogId)
        const authorId = req.author.AuthorId;
        const author = await Authors.findById(authorId);

        console.log("blog",blog)

        const index = blog.LikedBy.findIndex(id => id.toString() === authorId.toString());

        if(index == -1){

            blog.LikedBy.push(authorId);

            await blog.save()

            //  const updatedBlog = await Blogs.findById(blogId).populate("LikedBy",'authorname');

            return res.status(200).json({msg:"blog has been liked successfully..",
                blog
            })

        }else{
            blog.LikedBy.splice(index, 1);

            await blog.save()

            // const updatedBlog = await Blogs.findById(blogId).populate("LikedBy",'authorname');

            return res.status(200).json({msg:"blog has been unliked succesfully", blog})
        }
            
    }catch(err){
        console.error(err)
        res.status(500).json({msg:"internal server error.."})
    }
})

// bookmark a blog
app.post('/api/blog/:id/bookmark',authMiddleware,async (req,res) => {

    try{
        const blogId = req.params.id;
        // blog which has been requested to bookmark
        const blog = await Blogs.findById(blogId);
        // this is the authorId of the author who is logged in, 
        const authorId = req.author.AuthorId;
        // author logged-in
        const author = await Authors.findById(authorId)

        const index = blog.bookmarkedBy.findIndex((id) => id.toString() === authorId.toString());

        console.log("index",index);

        // index being equal to -1 will mean that the authorId doesn't exist in the interaction.bookmarkedBy array which would mean that the author hasn't bookmarked the blog,so the request is to bookmark the blog
        if(index === -1){
            blog.bookmarkedBy.push(authorId);
            await blog.save();
            return res.status(200).json({msg:"blog has been bookmarked successfully",blog})
        }else{
            // index not being -1 means that the author has already liked the blog and the request is to remove the bookmark
            blog.bookmarkedBy.splice(index,1);
            await blog.save(); 
            return res.status(200).json({msg:"blog has been unbookmarked successfully..",blog});
        }

        // res.status(200).json({interaction});
    }catch(err){
        res.status(500).json({msg:"internal server error.."})
    }
})

// comment a blog
app.post('/api/blog/:id/comment',authMiddleware,async (req,res) => {
   
    try{

        const authorId = req.author.AuthorId;
        console.log(authorId)
        const author = await Authors.findById(authorId)
        console.log("the author making the comment",author)
        const blogId = req.params.id;
        console.log(blogId)
        // commentBy.user is the path to populate (i.e. inside commentBy, the user field)
        // authorname is the projection string, you can include whatever fields you want from the Authors model,e.g. "authorname","email"
        const blog = await Blogs.findById(blogId).populate("commentBy.user","authorname");
       
       
        const {commentText} = req.body;

        if(!commentText){
            return res.status(400).json({msg:"please provide the comment text.."})
        }

        console.log("blog",blog)
        console.log("blog.commentedBy",blog.commentBy)

        blog.commentBy.push(
            {
                user : authorId,
                commentText : commentText
            }
        )

        console.log("blog commentator,",)

        await blog.save();

        const populatedBlog = await Blogs.findById(blogId).populate('commentBy.user','authorname')

        res.status(200).json({msg:"comment added successfully",blog:populatedBlog})

    }catch(err){
        console.error(err)
        res.status(500).json({msg:"internal server error.."})
    }
})

app.patch('/api/blog/:blogId/:commentId/update', async (req,res) => {
    try{
        const blogId = req.params.blogId;
        /* const blog = await Blogs.findById(blogId);
        console.log("blog being updated",blog) */
        const commentId = req.params.commentId;
        console.log("id of the comment being updated",commentId);

        const blog = await Blogs.findOne({"commentBy._id":commentId});
        console.log("blog",blog)
        const comment = blog.commentBy.filter((comment) => comment._id.toString() === commentId.toString());

        console.log(" comment being updated",comment);

        const {commentText} = req.body;

        if(!commentText){
            return res.status(400).json({msg:"please provide the new commentText to update the present text.."})
        }

        comment[0].commentText = commentText;

        await blog.save();

        res.status(200).json({msg:"comment has been updated successfully",comment})

        // console.log(blog)
    }catch(err){
        console.error(err)
        res.status(500).json({msg:"internal server error.."});
    }
})

app.delete('/api/blog/:blogId/:commentId/delete',async (req,res) => {
    try{
        const blogId = req.params.blogId;
        const blog = await Blogs.findById(blogId);
        const commentId = req.params.commentId;
        // const blog = await Blogs.findOne({"commentBy._id":commentId});
        console.log("the blog whose comment is being deleted",blog);

        // const comment = blog.commentBy.filter((comment) => comment._id.toString() === comment.toString());
        const index = blog.commentBy.findIndex((comment) => comment._id.toString() === commentId.toString());

        console.log("index of the comment being deleted",index)

        if(index == -1){
            return res.status(404).json({msg:"blog not found.."})
        }else{
            blog.commentBy.splice(index,1); 
            await blog.save()
        }

        res.status(200).json({msg:"comment has been successfully deleted",blog})

    }catch(err){
        console.error(err);
        res.status(500).json({msg:"internal server error..."})
    }
})

app.post('/api/logout',authMiddleware,(req,res) => {
    try{
        // this sets a header (Set-cookie) in http response.The actual "deletion" happens in the browser when the browser receives the response-but the function itself runs asynchronously in your code. 
        res.clearCookie('token')
        res.status(200).json({msg:"you have been successfully logged-out."})
    }catch(err){
        res.status(500).json({msg:"internal server error.."})
    }
})

const port = process.env.port || 3000;

app.listen(port,() => {
    console.log(`your server is running on port ${port}.`);
})