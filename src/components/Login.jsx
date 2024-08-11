  import {useState,React} from 'react'
  import { useNavigate } from "react-router-dom";


  const Login = () => {

  const [formData,setFormData]=useState(
    {
      email:'',
      password:''
    }
  );

  const navigate = useNavigate();

  const handleChanges=(e)=>{
      const {name,value}=e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));

  }




  const handleSubmit=async(event)=>
  {
      event.preventDefault();
      console.log(formData);
      

      const url = 'https://money-matrix-frontend.vercel.app/checkUser';

      try{
          const res=await fetch(url,{
            method:'POST',
            headers: {
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(formData)});

          const data=await res.json();
          console.log("Response Data:",data);
          if(data['success']===true)
          {
            console.log("Valid User");
            localStorage.setItem("user_id", data['userId']);
            console.log("Current User:", data['userId']);
            navigate('/entry');
          }

          else
          {
            console.log("Invalid Credentials");
          }
      }
      catch (error) {
        console.log('Error in storing data:', error);
      }    
  };

  const inputStyle='rounded-md border-black cursor-pointer m-4 p-1.5' 

    return (
      <div className='flex flex-col justify-center items-center'> 
          <br/>
          <form className='bg-gray-300 flex flex-col items-center rounded-3xl p-3' onSubmit={handleSubmit}>
              <h3 className='font-semibold text-3xl mt-5 '>Login</h3>
              <br/>
              <div className='form-group'>
                  <label>UserEmail</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChanges} className={inputStyle}></input>
              </div>
              <br/>
              <div className='form-group'>
                  <label>Password </label>
                  <input type="password" name="password" value={formData.password} onChange={handleChanges} className={inputStyle}></input>
              </div>
              <br/>
              <button className='text-white bg-blue-700 hover:bg-blue-800 rounded-md p-2'>Sign in</button>
          </form>
      </div>

    )
  }

  export default Login