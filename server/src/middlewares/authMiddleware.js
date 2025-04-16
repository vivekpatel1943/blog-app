import jwt from 'jsonwebtoken';

// to ensure only logged-in users can access our http routes(get,post,update,delete) we will create this authMiddleware we will use this middleware in all our routes to make sure that only logged in users can access this routes

const authMiddleware = (req,res,next) => {
    
    // by convention ,browsers send the token in the Authorization  header, that's what we are accessing 
    const token = req.header('Authorization');

    console.log(token);

    if(!token){
        return res.status(400).json({msg:"access denied , no token provided..."});
    }

    try{
        // you need your jwt_secret to create and verify your token
        // jwt verification is important to ensure that the token being sent is not expires and has not tampered with
        // jwt validation checks the structure , claims and signature to ensure the least amount of risk
        const decoded = jwt.verify(token,process.env.jwt_secret);

        if(!decoded){
            res.status(403).json({msg:"Invalid token.."})
        }

        console.log(decoded)

        // adding the decoded author data in the token to the request body
        // this consists of {userId: "6512ad87b4e7f5d5e92eae91"(MongoDB user ID), iat: 1711711717(Issued At Time (UNIX timestamp)),exp: 1711715317  (Expiry Time (UNIX timestamp))
        req.author = decoded;

        next(); //this just passes all the data to the next middleware        
    }catch(err){
        console.log(err)
        res.status(500).json({msg:"internal server error..",err})
    }
}


export default authMiddleware;
