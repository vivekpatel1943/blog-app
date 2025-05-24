import React, { useState, useEffect } from 'react';
import { useAuth } from './Root';

function AddComment(props) {

    const { activeCommentBlogId, setActiveCommentBlogId, author, authorId } = useAuth();

    console.log("active comment blog-id", activeCommentBlogId)
    // console.log("setActiveCommentBlogId",setActiveCommentBlogId)

    if (activeCommentBlogId !== props.blogId) return null;

    const handleSubmit = (formData) => {
        const commentText = formData.get("comment");
        console.log("commentText", commentText)
        props.onSubmit(commentText);
        console.log("onSubmit function has been executed..")
        // once the comment has been submitted the commentBox shall close,
        setActiveCommentBlogId(null);
    }

    const thisBlog = props.blogs.filter((blog) => blog._id == activeCommentBlogId)
    console.log("thisBlog", thisBlog)
    console.log("this Blog comments", thisBlog[0].commentBy)
    thisBlog[0].commentBy.forEach((comment) => {
        console.log("comments", comment.commentText, comment.commentator_info)
    })

    return (
        <div>
            {/* <h1>add-comment</h1> */}
            <div className='mt-6 p-4 bg-gray-100 rounded shadow-md'>
                <form action={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor='comment' className='block font-medium text-gray-700 mb-1'>Add your comment: </label>
                        <textarea id='comment' name='comment' rows="5" cols="33" className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'></textarea>
                    </div>

                    <button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow'>Submit</button>
                </form>
                <div className='mt-6 space-y-4'>
                    {
                        thisBlog[0].commentBy.length > 0 &&
                        thisBlog[0].commentBy.map((comment, index) => {

                            return (
                                <div key={index} className='border border-gray-300 p-3 rounded bg-white shadow-sm'>
                                    <span className='block text-sm text-gray-600 font-semibold mb-1'>{comment.user.authorname}</span><br></br>
                                    <span className='text-gray-800'>{comment.commentText}</span>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default AddComment;