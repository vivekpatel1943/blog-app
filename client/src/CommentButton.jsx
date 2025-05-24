import React from 'react';
import {MessageSquareText} from 'lucide-react';

function CommentButton({ blog, author, setShowLoginPromptComment, setActiveCommentBlogId, activeCommentBlogId }) {
    return (
        <button className='text-2xl transition hover:scale-110 px-2' onClick={() => {
            if (!author) {
                setShowLoginPromptComment(true)
                setTimeout(() => setShowLoginPromptComment(false), 3000);
            } else {
                setActiveCommentBlogId(activeCommentBlogId == blog._id ? null : blog._id);
            }
        }}><MessageSquareText className='w-8 h-8'/></button>
    )
}

export default CommentButton;