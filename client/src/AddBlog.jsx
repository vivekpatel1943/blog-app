import React,{useEffect,useState} from "react";
import axios from 'axios';

function AddBlog(){
    
   /*  const [formData,setFormData] = useState({
        heading:"",
        subHeading:"",
        mainContent:"",
        date : new Date(),
    });

    const handleChange = (event) => {
        setFormData({...formData,[event.target.name]:event.target.value})
        console.log(formData)
    } */

    async function handleSubmit(formData){
        // event.preventDefault();

        const heading = formData.get('heading');
        const subHeading = formData.get('subHeading');
        const mainContent = formData.get('mainContent');

        try{
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/blog`,{heading,subHeading,mainContent});
            console.log(response);
        }catch(err){
            console.error("error adding task",err,'.');
        }
    }

    return(
        <div>
            <form action={handleSubmit}>
                <label htmlFor="heading">Enter heading:</label>
                <input id="heading" name="heading" placeholder="songs of ice and fire" /* onChange={handleChange} *//>
                <label htmlFor="subHeading">Enter sub-heading:</label>
                <input id="subHeading" placeholder="john-snow,arya-stark and sansa-stark" name="subHeading" /* onChange={handleChange} *//>  
                <label htmlFor="mainContent">Enter mainContent:</label>
                <textarea id="mainContent" name="mainContent" /* onChange={handleChange} *//>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default AddBlog;
