import React,{useState,useEffect} from 'react';
import {useAuth} from './Root'; //importing the custom hook
import { useNavigate } from 'react-router-dom';


function Profile(){

    
    const navigate = useNavigate();

    const {profile,author,blogs,interId,setInterId,deleteBlog} = useAuth(); //importing functions and states from the AuthContext

    /* useEffect(() => {
        profile()
    },[]) */

    console.log("author ", author)

    // function to select the blog the user intends to delete 
    function select(blogId){
        setInterId(blogId)
    }

    return (
        <div>
            {blogs.map((blog) => (
                <div key={blog._id}>
                    
                    <h1 ><b>{blog.heading}</b></h1>
                    <h6><b>{blog.subHeading}</b></h6>
                    <p>{blog.mainContent}</p>
                    <p>author:{author}</p>
                    <button className='border-2 mr-2 px-2' onClick={() => {select(blog._id);navigate('/update-blog')}}>update</button>
                    <button className='border-2 px-2' onClick={() => {navigate('/delete-blog');select(blog._id)}}>delete</button>
                </div>
            ))}
        </div>
    );
}

export default Profile;