import React , {useEffect,useState} from 'react';
import {useAuth} from './Root';
import BookmarkBlog from './BookmarkButton';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import AddComment from './addComment';
import LoginPromptBookmark from './LoginPromptBookmark';
import LoginPromptComment from './LoginPromptComment';
import LoginPromptLike from './LoginPromptLike';


function Bookmarks(){

    const { authorId, allBlogs, setAllBlogs, likeBlog, bookmarkBlog, showLoginPromptComment, author, setActiveCommentBlogId, setShowLoginPromptComment, activeCommentBlogId, addCommentToTheBlog, showLoginPromptBookmark, setShowLoginPromptBookmark, showLoginPromptLike, setShowLoginPromptLike, handleLike, handleBookmark} = useAuth();

    const bookmarkedBlogs = allBlogs.filter((blog) => blog.bookmarkedBy.find((id) => id == authorId))

    console.log("bookmarked Blogs",bookmarkedBlogs)

    return(
        <div>
            {bookmarkedBlogs.map((blog) => {
                return(
                    <div>
                        <h1>{blog.heading}</h1>
                        <h6>{blog.subHeading}</h6>
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

                            <AddComment blogs={bookmarkedBlogs} blogId={blog._id} onSubmit={(commentText) => {
                                addCommentToTheBlog(blog._id, commentText);
                            }} />
                    </div>
                )
            })}
        </div>
    )
}

export default Bookmarks;