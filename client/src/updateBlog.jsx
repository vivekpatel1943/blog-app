import React,{useState,useEffect} from "react";
import axios from 'axios';
import {useAuth} from './Root';
import { useNavigate } from "react-router-dom";


function UpdateBlog(){

    const {updateBlog,interId,setInterId,blogs} = useAuth();
    const navigate = useNavigate();

    // updateBlog(interId,formData)

    console.log(JSON.stringify(blogs))

    const originalBlog = blogs.filter((blog) =>{ 
        if(blog._id == interId){
            console.log(blog._id)
            console.log(interId)
            return blog;
        }
    });

    // const originalBlog = blogs.filter((blog) => blog._id == interId);

    console.log(JSON.stringify(originalBlog))

    function handleSubmit(formData){
        const heading = formData.get('heading');
        const subHeading = formData.get('subHeading');
        const mainContent = formData.get('mainContent');

        updateBlog(interId,{heading,subHeading,mainContent})

        navigate('/profile')
    }

    return (
        <form action={handleSubmit}>
            <label htmlFor="heading">Enter heading: </label>
            <input id="heading" name="heading" defaultValue={originalBlog[0].heading}/>
            <label htmlFor="subHeading">Enter sub-heading:</label>
            <input id="subHeading"  name="subHeading" defaultValue={originalBlog[0].subHeading}/>  
            <label htmlFor="mainContent">Enter mainContent:</label>
            <textarea id="mainContent" name="mainContent" defaultValue={originalBlog[0].mainContent}/>
            <button type="submit">Save</button>
        </form>
    )
}

export default UpdateBlog;