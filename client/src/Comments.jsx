import React, {useState,useEffect} from 'react';
import {useAuth} from './Root';
import BookmarkBlog from './BookmarkButton';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import AddComment from './addComment';
import LoginPromptBookmark from './LoginPromptBookmark';
import LoginPromptComment from './LoginPromptComment';
import LoginPromptLike from './LoginPromptLike';

function Comments(){

    const {authorId, allBlogs, setAllBlogs, likeBlog, bookmarkBlog, showLoginPromptComment, author, setActiveCommentBlogId, setShowLoginPromptComment, activeCommentBlogId, addCommentToTheBlog, showLoginPromptBookmark, setShowLoginPromptBookmark, showLoginPromptLike, setShowLoginPromptLike, handleLike, handleBookmark} = useAuth();

    const commentBlogs =  allBlogs.filter((blog) => blog.commentBy.find((id) => id.user._id == authorId));
    
    console.log("commentBlogs",commentBlogs)

    return(
        <div>
            {commentBlogs.map((blog) => {
                return (
                    <div>
                        <h1>{blog.heading}</h1>
                        <h6>{blog.sunHeading}</h6>
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

                            <CommentButton blog={blog} author={author} setActiveCommentBlogId={setActiveCommentBlogId} setShowLoginPromptComment={setShowLoginPromptComment} activeCommentBlogId={activeCommentBlogId} />

                            <AddComment blogs={commentBlogs} blogId={blog._id} onSubmit={(commentText) => {
                                addCommentToTheBlog(blog._id, commentText);
                            }} />

                    </div>
                )
            })}
        </div>
    )
}

export default Comments;
