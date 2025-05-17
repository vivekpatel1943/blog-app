import React, {useState,useEffect} from 'react'; 

function LikeButton({blog,authorId,author,setShowLoginPromptLike,handleLike}){
    return(
        <button className={`like-button border-2 mx-2 px-2 ${blog?.LikedBy?.includes(authorId) ? 'bg-red-600' : 'bg-white-200'}`} onClick={() => {
                if (!author) {
                  setShowLoginPromptLike(true);
                  setTimeout(() => setShowLoginPromptLike(false), 3000);
                } else {
                  handleLike(blog._id)
                }
        }}>like</button>
    )
}

export default LikeButton;