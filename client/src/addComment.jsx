import React,{useState,useEffect} from 'react';
import {useAuth} from './Root'; 

function AddComment(props){

    const {activeCommentBlogId,setActiveCommentBlogId,author,authorId} = useAuth();

    console.log("active comment blog-id",activeCommentBlogId)
    // console.log("setActiveCommentBlogId",setActiveCommentBlogId)

    if(activeCommentBlogId !== props.blogId) return null;

    const handleSubmit = (formData) => {
        const commentText = formData.get("comment");
        console.log("commentText",commentText)
        props.onSubmit(commentText); 
        console.log("onSubmit function has been executed..")
        // once the comment has been submitted the commentBox shall close,
        setActiveCommentBlogId(null);
    }

    const thisBlog = props.blogs.filter((blog) => blog._id == activeCommentBlogId)
    console.log("thisBlog",thisBlog)
    console.log("this Blog comments", thisBlog[0].commentBy)
    thisBlog[0].commentBy.forEach((comment) => {
        console.log("comments",comment.commentText,comment.commentator_info)
    })

    return (
    <div>
        {/* <h1>add-comment</h1> */}
        <div>
          <form action={handleSubmit}>
            <label htmlFor='comment'>Add your comment: </label>
            <textarea id='comment' name='comment' rows="5" cols="33"></textarea>
            <button type='submit'>Submit</button>
          </form>
            {
                thisBlog[0].commentBy.length > 0 &&
                thisBlog[0].commentBy.map((comment,index) => {

                    return (
                        <div key={index}>
                            <span>{comment.user.authorname}</span><br></br>
                            <span>{comment.commentText}</span>
                        </div>
                    )
                })
            }
        </div>
    </div>
    )
}

export default AddComment;