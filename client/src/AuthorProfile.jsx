import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './Root';
import LikeButton from './LikeButton';
import Bookmark from './BookmarkButton';
import Comment from './CommentButton';
import AddComment from './addComment';
import LoginPromptBookmark from './LoginPromptBookmark';
import LoginPromptComment from './LoginPromptComment';
import LoginPromptLike from './LoginPromptLike';
function AuthorProfile() {

    const { allBlogs,setAllBlogs,likeBlog,bookmarkBlog, showLoginPromptComment, author, authorId, setActiveCommentBlogId, setShowLoginPromptComment, activeCommentBlogId, addCommentToTheBlog, showLoginPromptBookmark, setShowLoginPromptBookmark, showLoginPromptLike, setShowLoginPromptLike } = useAuth();

    const { authorname } = useParams();
    console.log(authorname)

    const authorBlogs = allBlogs.filter((blog) => blog.AuthorId.authorname == authorname);
    console.log("author", authorBlogs)

      // like a blog
  // setting the blogs state to a new state after a blog has been liked
  // so in this new version of that blog which has been liked it would have one more authorId in it's likedBy array,
  const handleLike = async (blogId) => {
    const response = await likeBlog(blogId);

    console.log("like response : ", response)

    // update frontend state
    setAllBlogs((prevBlogs) =>
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
    setAllBlogs((prevBlogs) => {
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

    return (
        <div>
            <h1><b>{authorname}</b></h1>
            {authorBlogs.map((blog) => {
                return (
                    <div key={blog._id}>
                        <h1>{blog.heading}</h1>
                        <h2>{blog.subHeading}</h2>
                        <p>{blog.mainContent}</p>
                        {showLoginPromptLike && (
                            <LoginPromptLike />
                        )
                        }

                        <LikeButton blog={blog} authorId={authorId} author={author} setShowLoginPromptLike={setShowLoginPromptLike} handleLike={handleLike} />
                        {showLoginPromptBookmark && (
                            <LoginPromptBookmark />
                        )}

                        <Bookmark blog={blog} authorId={authorId} author={author} setShowLoginPromptBookmark={setShowLoginPromptBookmark} handleBookmark={handleBookmark} />

                        {showLoginPromptComment && (
                            <LoginPromptComment />
                        )}

                        <Comment blog={blog} author={author} setActiveCommentBlogId={setActiveCommentBlogId} setShowLoginPromptComment={setShowLoginPromptComment} activeCommentBlogId={activeCommentBlogId} />

                        <AddComment blogs={authorBlogs} blogId={blog._id} onSubmit={(commentText) => {
                            addCommentToTheBlog(blog._id, commentText);
                        }} />

                    </div>
                )
            })}
        </div>
    )
}

export default AuthorProfile;