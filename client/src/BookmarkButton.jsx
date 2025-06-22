import React from 'react';
import {Bookmark} from 'lucide-react';
import { useAuth } from './Root';

function BookmarkBlog({blog,authorId,author,setShowLoginPrompt,handleBookmark}){
    const isBookmarked = blog?.bookmarkedBy?.includes(authorId);

    const {handleLoginPrompt} = useAuth();

    return(
         <button className={`text-2xl transition hover:scale-110 px-2`} onClick={() => {
                if (!author) {
                  
                  handleLoginPrompt(blog._id);
                  
                  setShowLoginPrompt({id:blog._id,create:false,like:false,bookmark:true,comment:false});
                  
                  setTimeout(() => setShowLoginPrompt({id:blog._id,create:false,like:false,bookmark:false,comment:false}),3000)
                } else {
                  handleBookmark(blog._id)
                }
              }}><Bookmark className={`w-8 h-8 ${isBookmarked ? 'text-black-600 fill-black-600 fill-current ' : 'text-black'}`}/></button>
    )
}

export default BookmarkBlog;