import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './Root';
import LikeButton from './LikeButton';
import BookmarkBlog from './BookmarkButton';
import Comment from './CommentButton';
import AddComment from './addComment';
import LoginPromptBookmark from './LoginPromptBookmark';
import LoginPromptComment from './LoginPromptComment';
import LoginPromptLike from './LoginPromptLike';
function AuthorProfile() {

    const { allBlogs,setAllBlogs,likeBlog,bookmarkBlog, showLoginPromptComment, author, authorId, setActiveCommentBlogId, setShowLoginPromptComment, activeCommentBlogId, addCommentToTheBlog, showLoginPromptBookmark, setShowLoginPromptBookmark, showLoginPromptLike, setShowLoginPromptLike,handleLike,handleBookmark } = useAuth();

    const { authorname } = useParams();
    console.log(authorname)

    const authorBlogs = allBlogs.filter((blog) => blog.AuthorId.authorname == authorname);
    console.log("author", authorBlogs)

  
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

                        <BookmarkBlog blog={blog} authorId={authorId} author={author} setShowLoginPromptBookmark={setShowLoginPromptBookmark} handleBookmark={handleBookmark} />

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