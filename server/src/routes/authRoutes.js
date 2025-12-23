import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Authors from '../models/Authors.js';
import dotenv from 'dotenv';
const app = express(); 

// configuring all our environment variables
dotenv.config();

app.use(express.json())

const router = express.Router(); 

router.post('/signup',async(req,res) => {
    try{
        const {authorname,email,password} = req.body;

        // adding return is very important to ensure early return , 
        // return to stop execution if the user does not provide email or password or authorname 
        if(!authorname || !email || !password){
            return res.status(400).json({msg:"authorname , email or password not send.."})
        }

        // 10 is the salt round here , salt rounds simply refer to the number of times a password will be hashed recursively, higher the salt round safer will be the password but hashing algorithm takes more time to generate the password  
        const hashedPassword = await bcrypt.hash(password,10);

        const newAuthor = new Authors({
            authorname : authorname,
            email : email,
            password:hashedPassword
        })

        // .save() is the method to save data in the mongodb database 
        await newAuthor.save();

        res.status(200).json({msg:"author registered successfully.",newAuthor});

    }catch(err){
        console.log(err);
        res.status(500).json({msg:"internal server error.."});
    }
})

// Author login 
// to let the author login we will need to know if he is signed up
router.post('/login',async (req,res) => {
    try{

        console.log("email", req.body.email)
        const {email,password} = req.body;

        console.log("email",email)

        // to check if somebody is signed in we need to see if their email and password is saved in our database
        // findOne method by mongoose expects an object {email:"b@example.com"} , so {email} is the shorthand for {email:email} or {email:"b@example.com"} , so be careful and only pass objects to this methods
        const Author =  await Authors.findOne({email});

        if(!Author){
            return res.status(404).json({msg:"author not found.."})
        }

        // we are comparing the passwords sent in the request body with the password saved in the database;
        const isMatch = await bcrypt.compare(password,Author.password);

        if(!isMatch){
            return res.status(400).json({msg:"wrong password.."})
        }

        // whenever the user logs in the server provides them a token which they will send on every upcoming request when the server has verified the user with that token it responds to their request  
        const token = jwt.sign({AuthorId:Author._id},process.env.jwt_secret,{expiresIn:'1w'});

        console.log(token)

        res
            .cookie('token',token,{
                httpOnly:true, //prevents javascript access to cookies , helps avoid XSS(cross-site scripting)
                // while in development this sets secure to false and in production this sets secure:true,
                secure:process.env.NODE_ENV === 'production', //ensures cookie is only sent over https in production
                sameSite: process.env.NODE_ENV === 'production' ? "none" : "lax", //prevent CSRF attacks
                maxAge:7*24*60*60*1000 //1 week in milliseconds
            })
            .status(200)
            .json({msg:"logged in successfully..",Author})
    }catch(err){
        res.status(500).json({msg:"internal server error.."})
        console.error(err);
    }
})


export default router;

