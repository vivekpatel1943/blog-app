import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

function LikeButton({ blog, authorId, author, setShowLoginPromptLike, handleLike }) {
  const isLiked = blog?.LikedBy?.includes(authorId);
  return (
    <button className={`text-2xl transition hover:scale-110 px-2`} onClick={() => {
      if (!author) {
        setShowLoginPromptLike(true);
        setTimeout(() => setShowLoginPromptLike(false), 3000);
      } else {
        handleLike(blog._id)
      }
    }}>{isLiked ? <Heart className='w-8 h-8 text-red-600 fill-red-600 mt-5' />
      : <Heart className='w-8 h-8 text-gray-900 mt-4' />}</button>
  )
}

export default LikeButton;