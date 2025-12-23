import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        authorname: "",
        email: "",
        createPassword: "",
        confirmPassword: "",
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (formData.createPassword !== formData.confirmPassword) {
            alert("passwords do not match..")
            return;
        }

        const signupPayload = {
            authorname: formData.authorname,
            email: formData.email,
            password: formData.createPassword
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, signupPayload)

            console.log(response);

            if (response.data.newAuthor.authorname == formData.authorname && response.data.newAuthor.email == formData.email) {
                alert("signup successfull...")
                navigate('/login')
            }
        } catch (err) {
            console.log("error signing up", err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Create an Account
                </h2>

                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Username
                    </label>
                    <input
                        name="authorname"
                        value={formData.authorname}
                        onChange={handleChange}
                        placeholder="@rahul18"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Email
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@gmail.com"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Password
                    </label>
                    <input
                        name="createPassword"
                        type="password"
                        value={formData.createPassword}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">
                        Confirm Password
                    </label>
                    <input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                    Sign Up
                </button>

                <p className="text-sm text-center text-gray-500">
                    Already have an account?
                    <span
                        onClick={() => navigate("/login")}
                        className="ml-1 text-indigo-500 cursor-pointer hover:underline"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );

}

export default Signup;