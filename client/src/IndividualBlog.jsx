import { useAuth } from "./Root";
import { useParams } from "react-router-dom";
import LikeButton from "./LikeButton";
import BookmarkBlog from "./BookmarkButton";
import Comment from "./CommentButton";

const IndividualBlog = () => {
    const {blogId} =  useParams();

    const { allBlogs, openIndividualBlog, setOpenIndividualBlog, toggleIndividualBlog,authorId, author, setShowLoginPromptLike, handleLike,setShowLoginPromptBookmark,handleBookmark,setShowLoginPromptComment, setActiveCommentBlogId, activeCommentBlogId } = useAuth();

    const blog = allBlogs.find((blog) => blog._id === blogId);

    console.log("individual blog",blog)

    if(!blog){
        return <div className="text-center py-10 text-gray-600">Blog not found.</div>
    }
/* 
    if(!blog && !openIndividualBlog){
        return null
    }; */

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-10 -x-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold">{blog.heading}</h1>
                <h2 className="text-sl text-gray-300">{blog.subHeading}</h2>
                <span className="text-blue-400 font-medium"><span className="text-white mx-2">Author:</span>{blog.AuthorId.authorname}</span>
                <p className="mt-4 leading-relaxed text-gray-200 whitespace-pre-line">{blog.mainContent}</p>
            </div>
                   
        </div>
    )
}

export default IndividualBlog;