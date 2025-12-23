import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState, createContext, useContext } from 'react';
import axios from 'axios';
import App from './App';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import AuthorProfile from './AuthorProfile';
import AddBlog from './AddBlog';
import UpdateBlog from './updateBlog';
import DeleteBlog from './deleteBlog';
// import LandingPage from './LandingPage';
import IndividualBlog from './IndividualBlog';
import Likes from './Likes';
import Bookmarks from './Bookmarks';
import Comments from './Comments';

axios.defaults.withCredentials = true;

// createContext() creates a context object that lets data travel from the parent component to children component without manually passing props at every level,
// createContext() gives us access to a provider and this provider lets you provide the context value to components
const AuthContext = createContext();

// this is our provider function
export function AuthProvider({ children }) {
    const [author, setAuthor] = useState(null);
    // blogs by the individual logged-in author
    const [blogs, setBlogs] = useState([]);
    // all blogs available , all the blogs written by all the authors,
    const [allBlogs, setAllBlogs] = useState([]);
    // authorId state holds the id of the person who is logged in
    const [authorId, setAuthorId] = useState(null);
    // deletion confirmed
    const [deleted, setDeleted] = useState(false);
    // the state interId and setInterId is being created with the intention of passing the id of the blog being interacted with to different components
    const [interId, setInterId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCommentBlogId, setActiveCommentBlogId] = useState(null);
   
    const [expandedBlogs, setExpandedBlogs] = useState({});
    const [openIndividualBlog, setOpenIndividualBlog] = useState(false);

   

    const [showLoginPrompt,setShowLoginPrompt] = useState({id : null,create:false,like:false,bookmark:false,comment:false})

    // here i will be trying to access the profile of the user who is logged-in
    const profile = async () => {
        try {
            console.log("calling the /api/profile")
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, { withCredentials: true })

            console.log(author)
            console.log("logged-in-profile-data", response.data)
            console.log("/api/profile response", response.data.author);
            // console.log("all the blogs by the author",response.data.blogs)
            setAuthor(response.data.author.authorname)
            setAuthorId(response.data.author._id)
            setBlogs(response.data.blogs)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        profile()
    }, [])

    async function getAllBlogs() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/blogs`);
            console.log("fetching all the blogs", response)

            const data = response.data;

            console.log('data', response.data);

            setAllBlogs(data);
            // console.log(response.data)

            // console.log(blogs)

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getAllBlogs()
    }, [])

    const login = async (credentials) => {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, credentials, { withCredentials: true });
        console.log("response sent when logged in...", response);
        console.log("authorname", response.data.Author._id)
        setAuthor(response.data.Author.authorname)
        setAuthorId(response.data.Author._id)
    }

    const updateBlog = async (blogId, formData) => {
        try {
            console.log("formData", formData)
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blogId}`, formData, { withCredentials: true });
            console.log(response);
        } catch (err) {
            console.error(err);
        }
    }

    const deleteBlog = async (blogId) => {
        try {
            if (deleted) {
                const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blogId}`);
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const likeBlog = async (blogId) => {
        try {

            // setLikedBlogs((prev) => new Set(prev).add(blogId));
            // the request toggles the like and unlike, refer to the backend logic for liking a blog(index.js(server))
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blogId}/like`, { withCredentials: true });
            console.log("response for the like request", response);

            return response;

            // console.log(liked);

        } catch (err) {
            console.error(err);

        }
    }

    const bookmarkBlog = async (blogId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blogId}/bookmark`, { withCredentials: true });
            console.log(response);
            return response;
        } catch (err) {
            console.error(err);
        }
    }

    const addCommentToTheBlog = async (blogId, commentText) => {
        try {
            console.log("just before calling the post comment request to the backend..")
            console.log("formData", commentText)
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blogId}/comment`, { "commentText": commentText }, { withCredentials: true });
            console.log("response for add comment request:", response);
            return response;
        } catch (err) {
            console.error(err);
        }
    }

    const updateComment = async (blogId, commentId, formData) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blogId}/${commentId}/update`, formData, { withCredentials: true })

            console.log("response", response);

            return response;
        } catch (err) {
            console.log(err);
        }
    }

    const deleteComment = async (blogId, commentId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blogId}/${commentId}/delete`, { withCredentials: true });

            console.log(response);

            return response;
        } catch (err) {
            console.error(err);
        }
    }

    const logout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/logout`);
            console.log(response);
            setAuthor(null);         
            setAuthorId(null)   
            return response;
        } catch (err) {
            console.error(err);
        }
    }

    // like a blog
    // setting the blogs state to a new state after a blog has been liked
    // so in this new version of that blog which has been liked it would have one more authorId in it's likedBy array,
    const handleLike = async (blogId) => {
        const response = await likeBlog(blogId);

        console.log("like response : ", response)

        // update frontend state
        setAllBlogs((prevBlogs) =>
            prevBlogs.map((blog) => {
                if (blog._id === blogId) {
                    return response.data.updatedBlog;
                } else {
                    return blog;
                }
            })
        )
    }

    // seeting the updated Blogs to our blogs state after one of the blogs is liked
    const handleBookmark = async (blogId) => {
        const response = await bookmarkBlog(blogId);

        console.log("bookmark response", response);

        // update frontend state
        setAllBlogs((prevBlogs) => {
            console.log("prevBlogs", prevBlogs)
            return prevBlogs.map((blog) => {
                if (blog._id === blogId) {
                    console.log("response.data.blog", response.data.updatedBlog)
                    return response.data.updatedBlog;
                } else {
                    console.log("blog", blog)
                    return blog;
                }
            })
        })
    }

    const toggleIndividualBlog = () => {
        setOpenIndividualBlog(true);

    }

    const handleLoginPrompt = (blogId) => {
        allBlogs.map((blog) => {
            if(blog.id === blogId){
                setShowLoginPrompt({id:blogId,create:false,like:false,bookmark:false,comment:false})
            }
        })
    }

    return (
        // this provider provided by the context AuthContext helps us to make the value of user state and login function available to component which calls useContext(AuthContext), the components being represented by children
        <AuthContext.Provider value={{ author, authorId, login, profile, updateBlog, deleteBlog, blogs, interId, setInterId, deleted, setDeleted, likeBlog, bookmarkBlog, addCommentToTheBlog, updateComment, deleteComment, activeCommentBlogId, setActiveCommentBlogId, logout, allBlogs, setAllBlogs, expandedBlogs, setExpandedBlogs, openIndividualBlog, setOpenIndividualBlog, toggleIndividualBlog,handleLike,handleBookmark,showLoginPrompt,setShowLoginPrompt,handleLoginPrompt }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

// here useAuth is a custom hook, we are using it to export our context "AuthContext"
// then from any other component we can import the functions,states exported by the AuthProvider function 
// with a very simple syntax const {login,user} = useAuth();
export function useAuth() {
    return useContext(AuthContext);
}

export default function Root() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/profile/:authorname' element={<AuthorProfile />} />
                    <Route path='/add-blog' element={<AddBlog />} />
                    <Route path='/update-blog' element={<UpdateBlog />} />
                    <Route path='/delete-blog' element={<DeleteBlog />} />
                    <Route path='/blog/:blogId/:heading' element={<IndividualBlog />} />
                    <Route path='/Likes' element={<Likes />} />
                    <Route path='/Bookmarks' element={<Bookmarks/>}/>
                    <Route path='/Comments' element={<Comments/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    )
}