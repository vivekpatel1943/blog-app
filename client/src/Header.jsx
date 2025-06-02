import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableOfContents } from 'lucide-react';

function Header({ author, showLoginPromptCreate, setShowLoginPromptCreate, sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    return (
        <header className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4 px-6'>
            <div className='max-w-6xl mx-auto flex items-center justify-between'>
                {/* Logo and title */}
                <div className='flex items-center gap-3'>
                    {/* placeholder for logo */}
                    <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg'>
                        B
                    </div>
                    <span className='text-xl font-semibold text-gray-800'>Blog-App</span>
                    <button className={`fixed ${author ? 'mt-9' : "mt-20"} left-2 ${screen.width <= 768 && 'mt-21'} z-50 bg-white p-0.5 rounded-md shadow`}
                        onClick={() => setSidebarOpen((prev) => !prev)}>
                        <TableOfContents />
                    </button>
                </div>

                {/* Navigation-buttons */}
                <div className='flex'>
                    {
                        (!author) &&
                        <div className='flex'>
                            <button onClick={() => navigate('/signup')} className='bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded shadow mr-2'>Signup</button>
                            <button onClick={() => navigate('/login')} className='bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded shadow mr-2'>Login</button>
                         
                        </div>
                    }

                    {showLoginPromptCreate && (
                        <p className='mb-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded shadow'>
                            please login to write blog posts
                        </p>
                    )
                    }
                       <button onClick={() => {
                        if (!author) {
                            setShowLoginPromptCreate(true);
                            setTimeout(() => setShowLoginPromptCreate(false), 3000);
                        } else {
                            navigate('/add-Blog')
                        }
                    }}
                        className='bg-purple-600 hover:bg-purple-700 text-white px-2 py-2 mx-2 rounded shadow'
                    >Create-Blog</button>

                    {author &&
                        <button className='bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded shadow' onClick={() => navigate('/profile')}>{author}</button>
                    }

                </div>
            </div>
        </header>
    )
}

export default Header;