import React, { useState, useEffect,useRef} from 'react';
import axios from 'axios';
import './App.css';
import { useAuth } from './Root';
import AddComment from './addComment';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import Bookmark from './BookmarkButton';
import Comment from './CommentButton';
import Header from './Header';
import LoginPromptComment from './LoginPromptComment';
import LoginPromptBookmark from './LoginPromptBookmark';
import LoginPromptLike from './LoginPromptLike';

function App() {

  const [blogs, setBlogs] = useState([]);
 
  const navigate = useNavigate();

  const {/* likedBlogs,setLikedBlogs, */likeBlog, author, authorId, bookmarkBlog, activeCommentBlogId, setActiveCommentBlogId, addCommentToTheBlog, updateComment, deleteComment,showLoginPromptCreate,setShowLoginPromptCreate,showLoginPromptBookmark,setShowLoginPromptBookmark,showLoginPromptLike,setShowLoginPromptLike,showLoginPromptComment,setShowLoginPromptComment,expandedBlogs,setExpandedBlogs} = useAuth();

  // we use useEffect hook when we have to interact with external systems i.e. systems outside of react
  async function getAllBlogs() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/blogs`);
      console.log("fetching all the blogs", response)

      const data = response.data;

      console.log('data', response.data);

      setBlogs(data);
      // console.log(response.data)

      // console.log(blogs)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, [])

  // like a blog
  // setting the blogs state to a new state after a blog has been liked
  // so in this new version of that blog which has been liked it would have one more authorId in it's likedBy array,
  const handleLike = async (blogId) => {
    const response = await likeBlog(blogId);

    console.log("like response : ", response)

    // update frontend state
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => {
        if (blog._id === blogId) {
          return response.data.blog;
        } else {
          return blog;
        }
      })
    )
  }

  // seeting the updated Blogs to our blogs state after one of the blogs is liked
  const handleBookmark = async (blogId) => {
    const response = await bookmarkBlog(blogId);

    console.log("bookmark response", response);

    // update frontend state
    setBlogs((prevBlogs) => {
      console.log("prevBlogs", prevBlogs)
      return prevBlogs.map((blog) => {
        if (blog._id === blogId) {
          console.log("response.data.blog", response.data.blog)
          return response.data.blog;
        } else {
          console.log("blog", blog)
          return blog;
        }
      })
    })
  }

  const handleExpandBlog = (blogId) => {
    console.log("expanded Blogs",expandedBlogs)
    setExpandedBlogs((prev) => ({
      ...prev,
      [blogId] : !prev[blogId]
    }));
  }  

  console.log(author)

  return (
    <div>
  
      <Header author={author} showLoginPromptCreate={showLoginPromptCreate} setShowLoginPromptCreate={setShowLoginPromptCreate} />

      {console.log("blogs", blogs)}
      <div className='max-w-4xl mx-auto space-y-6 px-4'>

        {blogs.map((blog) => {
     
          return (
            <div key={blog._id}>

              <h1><b>{blog.heading}</b></h1>
              <h5><b>{blog.subHeading}</b></h5>
              {/* this should be a link to the author's profile and the user should be able to see all the blogs of this author*/}
             
             {/* we have populated the authorname of every blog in the getAllBlogs route in the backend (index.js) in the AuthorId path */}
            <div>author:<span className='text-blue-600' onClick={() => navigate(`/profile/${blog.AuthorId.authorname}`)}>{blog.AuthorId.authorname}</span></div>
              

            {blog.mainContent.length >= 100 ?
            (expandedBlogs[blog._id] ? <p>{blog.mainContent} <span onClick={()=> handleExpandBlog(blog._id)}><b>shorten</b></span></p> : <p>{blog.mainContent.substring(0,100)}<span onClick={()=> handleExpandBlog(blog._id)}><b>see full blog</b></span></p>) : <p>{blog.mainContent}</p>}
            {console.log("maincontent",blog.mainContent.substring(0,100))}

              {/* <button className={`like-button border-2 mx-2 px-2 ${isLiked ? 'bg-red-600' : 'bg-white'}`} onClick={() => {likeBlog(blog._id);}}>like</button> */}

              {showLoginPromptLike && (
                <LoginPromptLike/>
              )
              }

              <LikeButton blog={blog} authorId={authorId} author={author} setShowLoginPromptLike={setShowLoginPromptLike}  handleLike={handleLike}/>

              {showLoginPromptBookmark && (
                <LoginPromptBookmark/>
              )}

              <Bookmark blog={blog} authorId={authorId} author={author} setShowLoginPromptBookmark={setShowLoginPromptBookmark} handleBookmark={handleBookmark} />

              {showLoginPromptComment && (
                <LoginPromptComment/>
              )}

              <Comment blog={blog} author={author} setActiveCommentBlogId={setActiveCommentBlogId} setShowLoginPromptComment={setShowLoginPromptComment} activeCommentBlogId={activeCommentBlogId}/>

              <AddComment blogs={blogs} blogId={blog._id} onSubmit={(commentText) => {
                addCommentToTheBlog(blog._id, commentText);
              }} />

            </div>)
        })}
      </div>
    </div>
  )
}

export default App;