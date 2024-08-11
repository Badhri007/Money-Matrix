import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [signupFormData, setSignupData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate=useNavigate();

  const handleChanges = (event) => {
    const { name, value } = event.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const inputStyle = 'border-black m-4 rounded-md'
  const handleSignup = async (event) => {
    event.preventDefault();
    console.log('Signup Data:', signupFormData);

    const url = 'https://money-matrix-frontend.vercel.app/storeUser';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupFormData)
      });
      const data = await res.json();
      const user_id = data._id;
      localStorage.setItem("user_id", user_id);
      console.log("User Id:", user_id);

      navigate('/login');
      // console.log("Sending data....",data);
    } catch (error) {
      console.log('Error in storing data:', error);
    }

  };

  return (

    <div className='flex flex-col justify-center items-center'>
      <br></br>
      <form onSubmit={handleSignup} className=' bg-gray-300 rounded-3xl flex flex-col items-center p-3'  >
        <h1 className='font-semibold text-3xl mt-5'>Signup</h1>
        <br />
        <div className='form-group'>
          <label>Username:</label>
          <input
            className={inputStyle}
            type="text"
            placeholder=" Enter your name"
            name="username"
            value={signupFormData.username}
            onChange={handleChanges}
            required
          />
        </div>
        <br />
        <div className='form-group'>
          <label>UserEmail:</label>
          <input
            type="email"
            className={inputStyle}
            placeholder=" Enter email id"
            name="email"
            value={signupFormData.email}
            onChange={handleChanges}
            required
          />
        </div>
        <br />
        <div className='form-group'>
          <label>Password:</label>
          <input
            type="password"
            className={inputStyle}
            placeholder=" Enter password"
            name="password"
            value={signupFormData.password}
            onChange={handleChanges}
            required
          />
        </div>
        <br />
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
