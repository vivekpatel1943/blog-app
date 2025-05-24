import React,{useState,useEffect} from 'react';
import { House } from 'lucide-react';
import { BookHeart } from 'lucide-react';
import { BookMarked } from 'lucide-react';
import { StickyNote } from 'lucide-react';
import profile_img from './assets/profile.png';
import { SquarePen } from 'lucide-react';
import { TableOfContents } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Sidebar({sidebarOpen,setSidebarOpen}) {
    const navigate = useNavigate();
    
    return (
        <div className={`transition-all duration-300 ease-in-out bg-white shadow-md rounded-xl p-4 flex flex-col gap-10 ${sidebarOpen ? 'w-48' : 'w-20'} fixed left-0 top-25`}>
         
            <button
                onClick={() => setSidebarOpen((prev) => !prev)}>
                <TableOfContents />
            </button>
            <button onClick={() => navigate('/')} className='flex gap-2 hover:cursor-pointer'><House />{sidebarOpen && "Home"}</button>
            <button onClick={() => navigate('/Likes')} className='flex gap-2 hover:cursor-pointer'><BookHeart />{sidebarOpen && "Likes"}</button>
            <button onClick={() => navigate('/Bookmarks')} className='flex gap-2 hover:cursor-pointer'><BookMarked />{sidebarOpen && "Bookmarks"}</button>
            <button onClick={() => navigate('/Comments')} className='flex gap-2 hover:cursor-pointer'><StickyNote />{sidebarOpen && "Comments"}</button>
            <button onClick={() => navigate('/profile')} className='flex gap-2 hover:cursor-pointer'><img src={profile_img} className='w-6 h-6'></img>{sidebarOpen && "Profile"}</button>
            <button onClick={() => navigate('/add-blog')} className='flex gap-2 hover:cursor-pointer'><SquarePen />{sidebarOpen && "Create a Blog"}</button>
        </div>
    )
}

export default Sidebar;