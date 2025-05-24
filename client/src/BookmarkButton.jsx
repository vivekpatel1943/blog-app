import React from 'react';
import {Bookmark} from 'lucide-react';

function BookmarkBlog({blog,authorId,author,setShowLoginPromptBookmark,handleBookmark}){
    const isBookmarked = blog?.bookmarkedBy?.includes(authorId);
    return(
         <button className={`text-2xl transition hover:scale-110 px-2`} onClick={() => {
                if (!author) {
                  setShowLoginPromptBookmark(true);
                  setTimeout(() => setShowLoginPromptBookmark(false), 3000)
                } else {
                  handleBookmark(blog._id)
                }
              }}><Bookmark className={`w-8 h-8 ${isBookmarked ? 'text-black-600 fill-black-600 fill-current ' : 'text-black'}`}/></button>
    )
}

export default BookmarkBlog;