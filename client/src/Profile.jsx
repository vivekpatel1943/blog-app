import React, { useState, useEffect } from 'react';
import { useAuth } from './Root'; //importing the custom hook
import { useNavigate } from 'react-router-dom';
import backwardArrow from './assets/backward.png';


function Profile() {

    const navigate = useNavigate();

    const { profile, author, blogs, interId, setInterId, deleteBlog, logout } = useAuth(); //importing functions and states from the AuthContext

    console.log("author ", author)

    // function to select the blog the user intends to delete 
    function select(blogId) {
        setInterId(blogId)
    }

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            {/* top-bar */}
            <div className='flex justify-between items-center mb-6'>
                <button onClick={goBack} className='flex items-center gap-2 text-blue-600 hover:underline'><img src={backwardArrow} className='w-5 h-5' alt="Go Back" />Back</button>
                <button onClick={() => { logout(); navigate('/login') }} className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow'>logout</button>
            </div>
            {/* blogs section */}
            <div className='space-y-6'>
                {blogs.map((blog) => (
                    <div key={blog._id} className='bg-white p-4 rounded shadow-md border border-gray-200'>
                        <h1 className='text-xl font-bold text-gray-800 mb-1'>{blog.heading}</h1>
                        <h6 className='text-md font-semibold text-gray-600 mb-2'>{blog.subHeading}</h6>
                        <p className='text-gray-700 mb-2'>{blog.mainContent}</p>
                        <p className='text-sm text-gray-500 mb-4'>author:<span className='font-medium'>{author}</span></p>

                        <div className='flex gap-3'>
                            <button className='bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded' onClick={() => { select(blog._id); navigate('/update-blog') }}>update</button>
                        <button className='bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded' onClick={() => { navigate('/delete-blog'); select(blog._id) }}>delete</button>
                        </div>
                        
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Profile;