import { useAuth } from "./Root";
import { useParams } from "react-router-dom";

const IndividualBlog = () => {
    const {blogId} =  useParams();

    const { allBlogs, openIndividualBlog, setOpenIndividualBlog, toggleIndividualBlog } = useAuth();

    const blog = allBlogs.filter((blog) => blog._id === blogId);

    console.log("individual blog",blog)


    if(!blog && !openIndividualBlog){
        return null
    };

    return (
        <div>
            <h1>{blog[0].heading}</h1>
            
            <h2>{blog[0].subHeading}</h2>
            <span>{blog[0].AuthorId.authorname}</span>
            <p>{blog[0].mainContent}</p>
        </div>
    )
}

export default IndividualBlog;