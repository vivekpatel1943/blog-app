import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { useAuth } from './Root';

function App() {

  const [blogs,setBlogs] = useState([])

  const {/* likedBlogs,setLikedBlogs, */likeBlog,author,authorId,bookmarkBlog} = useAuth();
  
  // we use useEffect hook when we have to interact with external systems i.e. systems outside of react
  async function getAllBlogs(){
    try{
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/blogs`);
      console.log(response)
      // console.log(interactions)

      const data = response.data.map((blog) => {
      console.log(blog, "whole blog")
       console.log(blog.InteractionsId?.likedBy , "blog liked by")
       console.log("authorid",authorId)
       console.log("author logged-in",author)
       return({
        ...blog,
        isLiked : blog.InteractionsId && blog.InteractionsId.likedBy ? blog.InteractionsId.likedBy.some(author => author._id === authorId) : false,
        isBookmarked :  blog.InteractionsId && blog.InteractionsId.bookmarkedBy ? blog.InteractionsId.bookmarkedBy.some(author => author._id === authorId) : false
       })
      })
      
      setBlogs(data); 
      // console.log(response.data)

      // console.log(blogs)
      
    }catch(err){
      console.error(err)
    }
  }

  useEffect(() => {
    if(authorId){
      getAllBlogs();
    }
    
  },[authorId]) 

  // like a blog
  // i don't need to write a logic for liking a blog that's already in the backend i simply need to find way to find the blogId of the blog being clicked,

  const handleLike = async (blogId) => {
    const response = await likeBlog(blogId);

    console.log("like response : ",response)

    // update frontend state
    setBlogs((prevBlogs) => 
      prevBlogs.map(blog => 
        blog._id === blogId ? {...blog,isLiked:response.data.liked} : blog
      )
    )
  }

  const handleBookmark = async (blogId) => {
    const response = await bookmarkBlog(blogId);

    console.log("bookmark response",response);
 
    // update frontend state
    setBlogs((prevBlogs) => 
      prevBlogs.map(blog => 
        blog._id === blogId ? {...blog, isBookmarked : response.data.bookmarked} : blog
      )
    )
  }

  return (
    <div>
      {console.log(blogs)}
     {blogs.map((blog) => {
      // console.log(JSON.stringify(blogs))
      // console.log(JSON.stringify(blog))
      // console.log(blog.isLiked)

      // const isLiked = likedBlogs.has(blog._id) 
      
      return (
      <div key={blog._id}>
        <h1><b>{blog.heading}</b></h1>
        <h5><b>{blog.subHeading}</b></h5>
        <p>{blog.mainContent}</p>
        <p>{blog.isLiked}</p>
        {/* <button className={`like-button border-2 mx-2 px-2 ${isLiked ? 'bg-red-600' : 'bg-white'}`} onClick={() => {likeBlog(blog._id);}}>like</button> */}
        <button className={`like-button border-2 mx-2 px-2 ${blog.isLiked ? 'bg-red-600' : 'bg-white-200'}`} onClick={() => handleLike(blog._id)}>like</button>
        <button className={`bookmark-button border-2 mx-2 px-2 ${blog.isBookmarked ? 'bg-green-600 ' : 'bg-white-200 text-black'}`} onClick={() => handleBookmark(blog._id)}>bookmark</button>
        <button className='comment-button border-2 mx-2 px-2'>comment</button>
      </div>)
     })}
    </div>
  )
}

export default App;