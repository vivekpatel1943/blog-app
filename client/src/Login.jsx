import {useState,useEffect} from 'react';
import {useAuth} from './Root';
import {useNavigate} from 'react-router-dom';


function Login(){
    const {login,author} = useAuth();
    console.log(JSON.stringify(author));
    const navigate = useNavigate();
    const [credentials,setCredentials] = useState({email:"",password:""});
    const [error,setError] = useState(null);
    // const [loading,setLoading] = useState(false);

    const handleChange = (e) => {
        // adds the values entered to the credentials 
        setCredentials({...credentials,[e.target.name] : e.target.value});
        // the line below will assign same value to both email and password
        // setCredentials({...credentials,email : e.target.value,password:e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // setLoading(true);

        try{
            await login(credentials);
        }catch(err){
            setError("entered email or password..")
            // setLoading(false);
        }
    }

    return (

        <div>
            <h1>Login</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='email'>Enter email : </label>
                    <input htmlFor='email' type='email' name='email' onChange={handleChange} required />
                    <label htmlFor='password'>Enter password: </label>
                    <input htmlFor='password' type='password' name='password' onChange={handleChange} required/>
                    <button>login</button>
                </form>
            </div>
        </div>
    )
}


export default Login;