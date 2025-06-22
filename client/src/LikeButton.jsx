import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from './Root';

function LikeButton({ blog, authorId, author, setShowLoginPrompt, handleLike }) {
  const isLiked = blog?.LikedBy?.includes(authorId);

  const { handleLoginPrompt } = useAuth();

  return (
    <button className={`text-2xl transition hover:scale-110 px-2`} onClick={() => {
      if (!author) {
        handleLoginPrompt(blog._id)
        setShowLoginPrompt({id:blog._id,create:false,like:true,bookmark:false,comment:false});
        setTimeout(() => setShowLoginPrompt({id:blog._id,create:false,like:false,bookmark:false,comment:false}), 3000);

      } else {
        handleLike(blog._id)
      }
    }}>{isLiked ? <Heart className='w-8 h-8 text-red-600 fill-red-600 mt-5' />
      : <Heart className='w-8 h-8 text-gray-900 mt-4' />}</button>
  )
}

export default LikeButton;