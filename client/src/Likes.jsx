import React, { useEffect, useState } from 'react';
import { useAuth } from './Root';
import BookmarkBlog from './BookmarkButton';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import AddComment from './addComment';
import LoginPromptBookmark from './LoginPromptBookmark';
import LoginPromptComment from './LoginPromptComment';
import LoginPromptLike from './LoginPromptLike';

function Likes() {
    const { authorId, allBlogs, setAllBlogs, likeBlog, bookmarkBlog, showLoginPromptComment, author, setActiveCommentBlogId, setShowLoginPromptComment, activeCommentBlogId, addCommentToTheBlog, showLoginPromptBookmark, setShowLoginPromptBookmark, showLoginPromptLike, setShowLoginPromptLike, handleLike, handleBookmark } = useAuth();

    console.log("author id", authorId)

    const likedBlogs = allBlogs.filter((blog) => blog.LikedBy.find((id) => id == authorId))

    console.log("liked blogs", likedBlogs)

    return (
        <div>
            {
                likedBlogs.map((blog) => {
                    return (
                        <div>
                            <h1>{blog.heading}</h1>
                            <h1>{blog.subHeading}</h1>
                            <h1>{blog.mainContent}</h1>
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

                            <AddComment blogs={likedBlogs} blogId={blog._id} onSubmit={(commentText) => {
                                addCommentToTheBlog(blog._id, commentText);
                            }} />

                        </div>
                    )
                })
            }
        </div>
    )
}

export default Likes;