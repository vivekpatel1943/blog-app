import React, { useEffect, useState } from "react";
import axios from 'axios';

function AddBlog() {

    async function handleSubmit(formData) {
        // event.preventDefault();

        const heading = formData.get('heading');
        const subHeading = formData.get('subHeading');
        const mainContent = formData.get('mainContent');

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/blog`, { heading, subHeading, mainContent });
            console.log(response);
        } catch (err) {
            console.error("error adding task", err, '.');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Blog</h1>
                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="heading" className="block text-gray-700 font-medium mb-1">Enter heading:</label>
                        <input id="heading" name="heading" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none 
                        focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="subHeading" className="block text-gray-700 font-medium mb-1" >Enter sub-heading:</label>
                        <input id="subHeading" name="subHeading" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label htmlFor="mainContent" className="block text-gray-700 font-medium mb-1">Enter mainContent:</label>
                        <textarea id="mainContent" name="mainContent" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">Submit</button>
                    </div>

                </form>
            </div>

        </div>
    )
}

export default AddBlog;
