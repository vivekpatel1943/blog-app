import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { useAuth } from './Root';
import AddComment from './addComment';
import { useNavigate } from 'react-router-dom';
import LikeButton from './LikeButton';
import BookmarkBlog from './BookmarkButton';
import Comment from './CommentButton';
import Header from './Header';
import LoginPromptComment from './LoginPromptComment';
import LoginPromptBookmark from './LoginPromptBookmark';
import LoginPromptLike from './LoginPromptLike';
import Sidebar from './Sidebar.jsx';


function App() {

  const [blogs, setBlogs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [smallScreenSidebarOpen,setSmallScreenSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const {likeBlog, author, authorId, bookmarkBlog, activeCommentBlogId, setActiveCommentBlogId, addCommentToTheBlog, updateComment, deleteComment, expandedBlogs, setExpandedBlogs, openIndividualBlog, setOpenIndividualBlog, toggleIndividualBlog,handleLoginPrompt,setShowLoginPrompt,showLoginPrompt } = useAuth();

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
          return response.data.updatedBlog;
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
    console.log("expanded Blogs", expandedBlogs)
    setExpandedBlogs((prev) => ({
      ...prev,
      [blogId]: !prev[blogId]
    }));
  }

  console.log(author)

  return (
    <div>
      <Header author={author} /* showLoginPromptCreate={showLoginPromptCreate} setShowLoginPromptCreate={setShowLoginPromptCreate} */ showLoginPrompt={showLoginPrompt} setShowLoginPrompt={setShowLoginPrompt} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      {console.log("blogs", blogs)}
      <div className={`flex ${sidebarOpen ? "gap-4" : " mt-5 gap-0 "}  max-w-7xl mx-auto pt-32 ${sidebarOpen ? 'pl-52' : 'pl-0'}`}>

        {/* sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className={`flex flex-1 flex-col gap-10`}>
         
          {blogs.map((blog) => {

            return (
              <div key={blog._id} className='bg-white rounded-2xl shadow-md p-6 transition-all hover:shadow-lg hover:scale-[1.01]'>

                <h1 onClick={() => { toggleIndividualBlog(); navigate(`/blog/${blog._id}/${blog.heading}`) }} className='text-2xl font-bold text-gray-800 cursor-pointer hover:underline'>{blog.heading}</h1>
                <h5 className='text-lg font-semibold text-gray-600 mt-1'>{blog.subHeading}</h5>
                {console.log("individual blog open", openIndividualBlog)}
                {/* this should be a link to the author's profile and the user should be able to see all the blogs of this author*/}

                {/* we have populated the authorname of every blog in the getAllBlogs route in the backend (index.js) in the AuthorId path */}
                <div className='text-sm text-gray-500 mt-2'>author:<span className='text-blue-600 font-medium cursor-pointer hover:underline' onClick={() => navigate(`/profile/${blog.AuthorId.authorname}`)}>{blog.AuthorId.authorname}</span></div>

                {blog.mainContent.length >= 100 ?
                  (expandedBlogs[blog._id] ? <p className='text-gray-700 mt-3'>{blog.mainContent} <span onClick={() => handleExpandBlog(blog._id)} className='text-blue-600 cursor-pointer font-semibold hover:underline'>shorten</span></p> : <p>{blog.mainContent.substring(0, 100)}<span onClick={() => handleExpandBlog(blog._id)} className='text-blue-600 cursor-pointer font-semibold hover:underline'>see full blog</span></p>) : <p className='text-gray-700 mt-3'>{blog.mainContent}</p>}
                {console.log("maincontent", blog.mainContent.substring(0, 100))}

               

                 {(blog._id === showLoginPrompt.id && showLoginPrompt.like) && (
                  <LoginPromptLike/>
                )}

           
                <LikeButton blog={blog} authorId={authorId} author={author} setShowLoginPrompt={setShowLoginPrompt} handleLike={handleLike} />

               
                {(showLoginPrompt.id === blog._id && showLoginPrompt.bookmark) && (
                  <LoginPromptBookmark />
                )}

                <BookmarkBlog blog={blog} authorId={authorId} author={author} setShowLoginPrompt={setShowLoginPrompt} handleBookmark={handleBookmark} />

                {(blog._id === showLoginPrompt.id && showLoginPrompt.comment) && (
                  <LoginPromptComment />
                )}

                <Comment blog={blog} author={author} setActiveCommentBlogId={setActiveCommentBlogId} setShowLoginPrompt={setShowLoginPrompt} activeCommentBlogId={activeCommentBlogId} />

                <AddComment blogs={blogs} blogId={blog._id} onSubmit={(commentText) => {
                  addCommentToTheBlog(blog._id, commentText);
                }} />

              </div>)
          })}
        </div>
      </div>
    </div>
  )
}

export default App;