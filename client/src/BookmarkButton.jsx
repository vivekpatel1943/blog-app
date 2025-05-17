import React from 'react';

function Bookmark({blog,authorId,author,setShowLoginPromptBookmark,handleBookmark}){
    return(
         <button className={`bookmark-button border-2 mx-2 px-2 ${blog?.bookmarkedBy?.includes(authorId) ? 'bg-green-600' : 'bg-white-200 text-black'}`} onClick={() => {
                if (!author) {
                  setShowLoginPromptBookmark(true);
                  setTimeout(() => setShowLoginPromptBookmark(false), 3000)
                } else {
                  handleBookmark(blog._id)
                }
              }}>bookmark</button>
    )
}

export default Bookmark;