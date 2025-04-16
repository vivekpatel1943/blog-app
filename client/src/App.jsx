import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import './App.css'

function App() {

  const [blogs,setBlogs] = useState([])
  
  // we use useEffect hook when we have to interact with external systems i.e. systems outside of react
  async function getAllBlogs(){
    try{
      const response = await axios.get('http://localhost:5005/api/blogs');
      console.log(response)
      // console.log(interactions)
      setBlogs(response.data); 
    }catch(err){
      console.error(err)
    }
  }

  useEffect(() => {
    getAllBlogs();
  },[]) 

  // like a blog
  // i don't need to write a logic for liking a blog that's already in the backend i simply need to find way to find the blogId of the blog being clicked,
  /* async function likeAPost(blogId){
    try{
      const postResponse = await axios.post(`http://localhost:5005/api/blog/${blogId}/like`,
        {},
        {
          headers : {
            Authorization : `${token}`
      }});
    console.log(postResponse)
    }catch(err){
      console.error(err)
    }
    
  } */

  
  return (
    <div>
     {blogs.map((blog) => {
      return (
      <div key={blog._id}>
        <h1><b>{blog.heading}</b></h1>
        <h5><b>{blog.subHeading}</b></h5>
        <p>{blog.mainContent}</p>
        <button className='like-button border-2 mx-2 px-2' onClick={() => likeAPost(blog._id)}>like</button>
        <button className='bookmark-button border-2 mx-2 px-2'>bookmark</button>
        <button className='comment-button border-2 mx-2 px-2'>comment</button>
      </div>)
     })}
    </div>
  )
}

export default App;
