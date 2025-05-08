import React, {useState,useEffect} from 'react';
import axios from 'axios';

function Signup(){

    const [formData,setFormData] = useState({
        authorname : "",
        email : "",
        createPassword : "",
        confirmPassword : "",
    });

    const [signupFormData,setSignupFormData] = useState({
        authorname:"",
        email: "",
        password:""
    })

    const handleChange = (event) => {
        setFormData({...formData,[event.target.name]:event.target.value})
    }

    async function handleSubmit(event){
        event.preventDefault();

        if(formData.createPassword === formData.confirmPassword){
            setSignupFormData({authorname:formData.authorname,email:formData.email,password:formData.createPassword})
        }

        console.log(signupFormData)

        try{
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,signupFormData)

            console.log(response);
        }catch(err){
            console.log("error signing up",err)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor='authorname'>Enter username:</label>
                <input id='authorname' name='authorname' value={formData.authorname} placeholder='@rahul18' onChange={handleChange}/>
                <label htmlFor='email'>Enter Email:</label>
                <input id='email' name='email' value={formData.email} placeholder='rahul@gmail.com' onChange={handleChange} />
                <label htmlFor='create-password'>Password:</label>
                <input id='create-password' name='createPassword' value={formData.createPassword} onChange={handleChange} />
                <label htmlFor='confirm-password'>Confirm-Password</label>
                <input id='confirm-password' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} />
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default Signup;