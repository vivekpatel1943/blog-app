import React, { useState, useEffect } from 'react';
import { useAuth } from './Root';

import { House, BookHeart, BookMarked, StickyNote, SquarePen, TableOfContents } from 'lucide-react';

import profile_img from './assets/profile.png';

import { useNavigate } from 'react-router-dom';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();
    const { author, showLoginPromptCreate, setShowLoginPromptCreate } = useAuth();

    return (
        <div className='flex flex-col'>
            <button className='fixed left-5 top-25 mt-5 px-0'
                onClick={() => setSidebarOpen((prev) => !prev)}>
                <TableOfContents />
            </button>
            <div className={`transition-all duration-300 ease-in-out bg-white shadow-md rounded-xl p-4 flex flex-col gap-10 ${sidebarOpen ? 'flex w-screen h-full fixed inset-0 z-50 md:w-48' : 'w-0 h-screen md:flex md:w-20 '} md:fixed md:left-0 md:top-35 ${(!sidebarOpen && !(screen.width <= 768)) && `w-0` }`}>
                {(screen.width <= 768 && sidebarOpen) && <button
                    onClick={() => setSidebarOpen((prev) => !prev)}>
                    <TableOfContents />
                </button>}
                <button onClick={() => navigate('/')} className='flex gap-2 hover:cursor-pointer'><House />{sidebarOpen && "Home"}</button>
                <button onClick={() => navigate('/Likes')} className='flex gap-2 hover:cursor-pointer'><BookHeart />{sidebarOpen && "Likes"}</button>
                <button onClick={() => navigate('/Bookmarks')} className='flex gap-2 hover:cursor-pointer'><BookMarked />{sidebarOpen && "Bookmarks"}</button>
                <button onClick={() => navigate('/Comments')} className='flex gap-2 hover:cursor-pointer'><StickyNote />{sidebarOpen && "Comments"}</button>
                <button onClick={() => navigate('/profile')} className='flex gap-2 hover:cursor-pointer'><img src={profile_img} className='w-6 h-6'></img>{sidebarOpen && "Profile"}</button>

                {showLoginPromptCreate && (
                    <p className='mb-0 text-sm text-red-600 bg-red-100 px-4 py-0 rounded shadow'>
                        please login to write blog posts
                    </p>
                )
                }
                <button onClick={() => {
                    if (!author) {
                        setShowLoginPromptCreate(true);
                        setTimeout(() => setShowLoginPromptCreate(false), 3000);
                    } else {
                        navigate('/add-Blog');
                    }
                }} className='flex gap-2 hover:cursor-pointer'><SquarePen />{sidebarOpen && "Create a Blog"}</button>
            </div>
        </div>
    )
}

export default Sidebar;