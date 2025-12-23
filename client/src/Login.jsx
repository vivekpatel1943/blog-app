import { useState, useEffect } from 'react';
import { useAuth } from './Root';
import { useNavigate } from 'react-router-dom';
import backwardArrow from './assets/backward.png';


function Login() {
    const { login, author } = useAuth();
    console.log(JSON.stringify(author));
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    // const [loading,setLoading] = useState(false);

    const handleChange = (e) => {
        // adds the values entered to the credentials 
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        // the line below will assign same value to both email and password
        // setCredentials({...credentials,email : e.target.value,password:e.target.value})
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // setLoading(true);

        try {
            await login(credentials);
        } catch (err) {
            setError("entered email or password do not match the credentials of any of our registered users..")
            // setLoading(false);
        }
    }

    // well if the user is trying to login that obviously means that he is not logged-in which means that author is null/undefined basically a falsy but when the user will be logged in and the token will have been sent author will be truthy, 
    useEffect(() => {
        if (author) {
            navigate('/');
        }
    }, [author, navigate])

    function goBack() {
        navigate(-1);
    }

    return (

        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
              
            <div className='max-w-md w-full bg-white shadow-lg rounded-xl p-8'>
                 <div className='flex items-center gap-2 mb-6'>
                    <button onClick={() => goBack()} className='flex items-center text-blue-600 hover:underline'><img src={backwardArrow} className='h-5 w-5' alt="go back"></img>
                        go back
                    </button>
                </div>
                <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <label htmlFor='email' className='block text-gray-700 font-medium '>Enter email : </label>
                    <input htmlFor='email' type='email' name='email' onChange={handleChange} className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400' required />

                    <label htmlFor='password' className='block text-gray-700 font-medium'>Enter password: </label>
                    <input htmlFor='password' type='password' name='password' onChange={handleChange} className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400' required />

                    {error && <p className='text-red-500 text-sm'>{error}</p>}

                    <button type='submit'
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow'
                    >login</button>
                </form>
            </div>
        </div>
    )
}


export default Login;