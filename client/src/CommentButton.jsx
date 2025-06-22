import React from 'react';
import {MessageSquareText} from 'lucide-react';
import { useAuth } from './Root';

function CommentButton({ blog, author, setShowLoginPrompt, setActiveCommentBlogId, activeCommentBlogId }) {

    const {handleLoginPrompt} = useAuth();

    return (
        <button className='text-2xl transition hover:scale-110 px-2' onClick={() => {
            if (!author) {
                handleLoginPrompt(blog._id)
                setShowLoginPrompt({id:blog._id,create:false,like:false,bookmark:false,comment:true})
                setTimeout(() => setShowLoginPrompt({id:blog._id,create:false,like:false,bookmark:false,comment:false}), 3000);
            } else {
                setActiveCommentBlogId(activeCommentBlogId == blog._id ? null : blog._id);
            }
        }}><MessageSquareText className='w-8 h-8'/></button>
    )
}

export default CommentButton;