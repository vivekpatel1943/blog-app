import React from 'react';

function Comment({ blog, author, setShowLoginPromptComment, setActiveCommentBlogId, activeCommentBlogId }) {
    return (
        <button className='comment-button border-2 mx-2 px-2' onClick={() => {
            if (!author) {
                setShowLoginPromptComment(true)
                setTimeout(() => setShowLoginPromptComment(false), 3000);
            } else {
                setActiveCommentBlogId(activeCommentBlogId == blog._id ? null : blog._id);
            }
        }}>comment</button>
    )
}

export default Comment;