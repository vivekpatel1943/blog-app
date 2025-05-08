import React,{useState,useEffect} from 'react';
import { useAuth } from './Root';

function DeleteBlog(){
    const {deleteBlog,deleted,interId,setDeleted} = useAuth();

    // deleteBlog(interId);

    deleteBlog(interId)

    return (
        <button onClick={() => setDeleted(true)}>delete</button>
    )
}

export default DeleteBlog;
