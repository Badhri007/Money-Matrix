import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
const Hero = () => {
    const [count, setCount] = useState(1);
    const [formData, setFormData] = useState([{ name: '', amount: '', expense_type: '' }]);
    const [date, setDate] = useState('');

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newFormData = [...formData];
        newFormData[index][name] = value;
        setFormData(newFormData);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("Form data:", formData);
        const url = 'https://money-matrix-backend.vercel.app/storeExpenses';

        try {
            const user_id = localStorage.getItem("user_id");
            if (!user_id) {
                console.error('User ID not found in localStorage');
                return;
            }


            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id, date, entry: formData })
            });
            console.log("Hello");
            const data = await res.json();
            console.log(data);

            setCount(1);
            setFormData([{ name: '', amount: '', expense_type: '' }]);
            setDate('');


        } catch (error) {
            console.log('Error in storing data:', error);
        }
    };

    const addNewExpense = () => {
        setCount(count + 1);
        setFormData([...formData, { name: '', amount: '', expense_type: '' }]);
    };

    return (
        <div className='flex items-center justify-center bg-gray-100'>
            <form
                className='bg-gray-300 p-10 flex justify-center flex-col rounded-3xl items-center mt-5'
                onSubmit={handleSubmit}
            >
                <h2 className='text-2xl font-semibold'>Expense Entry</h2>
                <br />
                <label>Enter Date:</label>
                <input
                    className='rounded-md'
                    type='date'
                    value={date}
                    required
                    onChange={handleDateChange}
                ></input>
                <br />
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index}>
                        <div className='flex gap-x-2'>
                            <label>Enter Name:</label>
                            <input
                                type='text'
                                className='rounded-md'
                                name='name'
                                value={formData[index].name}
                                required
                                onChange={(e) => {
                                    handleInputChange(index, e);
                                }}
                            ></input>
                            <br />
                            <label>Enter Amount:</label>
                            <input
                                type='number'
                                className='rounded-md'
                                name='amount'
                                value={formData[index].amount}
                                required
                                onChange={(e) => {
                                    handleInputChange(index, e);
                                }}
                            ></input>
                            <br />
                            <label> Enter Expense Type:</label>
                            <select name='expense_type' value={formData[index].expense_type} onChange={(e) => {
                                handleInputChange(index, e);
                            }} required >
                                <option value="" disabled>Select type</option>
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Education">Education</option>
                                <option value="Medical">Medical</option>
                                <option value="Cosmetics">Cosmetics</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <br />
                    </div>
                ))}
                <br />
                <div className='rounded-[50%] px-3 py-2 bg-gray-400 cursor-pointer' onClick={addNewExpense}><FontAwesomeIcon icon={faPlus} /></div>
                <br />
                <button className='m-auto block bg-blue-700 text-white p-2 rounded-md' type='submit'> Add Expense </button>
            </form>
        </div>
    );
};

export default Hero;
