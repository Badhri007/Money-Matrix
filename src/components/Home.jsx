import React, { useState } from 'react';
import Stat from '../components/Stat';
import Graph from '../components/Graph';

const Home = () => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [monthExpenses, setMonthExpenses] = useState([]);
  const [yearExpenses, setYearExpenses] = useState([]);
  const [isMonthly, setIsMonthly] = useState(true);

  const handleMonthlySummary = async (event) => {
    event.preventDefault();
    console.log("Month:", month, "Year:", year);

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error('User ID not found in localStorage');
      return;
    }

    const url = 'https://money-matrix-backend.vercel.app/getExpenseTypeMonthWise';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user_id': user_id
        },
        body: JSON.stringify({ month: month, year: year })
      });
      const data = await res.json();

      console.log("Filtered Data:", data);
      setMonthExpenses(data.month_expenses);
      // setYearExpenses(data.year_expenses);

    } catch (error) {
      console.log('Error:', error);
    }
  };



  const handleYearlySummary = async (event) => {
    event.preventDefault();
    console.log("Year:", year);

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error('User ID not found in localStorage');
      return;
    }

    const url = 'https://money-matrix-backend.vercel.app/getExpenseTypeYearWise';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user_id': user_id
        },
        body: JSON.stringify({ year: year })
      });
      const data = await res.json();

      console.log("Filtered Data:", data);
      // setMonthExpenses(data.month_expenses);
      setYearExpenses(data.year_expenses);

    } catch (error) {
      console.log('Error:', error);
    }

  }

  const handleToggle = () => {
    setIsMonthly(!isMonthly);
  };

  return (
    <div className='flex flex-col justify-center mt-2 '>
      <div className="container mx-auto p-4 w-80 ">
        <div className="relative flex items-center bg-yellow-500 rounded-full w-64 h-[8vh] mx-auto">
          <input type="radio" id="switchMonthly" name="switchPlan" value="Monthly" checked={isMonthly} onChange={handleToggle} className="sr-only peer" />
          <input type="radio" id="switchYearly" name="switchPlan" value="Yearly" checked={!isMonthly} onChange={handleToggle} className="sr-only peer" />
          <label htmlFor="switchMonthly" className={`flex-1 text-center cursor-pointer text-white font-md  ${isMonthly ? ' z-10 text-yellow-700  font-semibold' : ''}`}>Monthly</label>
          <label htmlFor="switchYearly" className={`flex-1 text-center cursor-pointer text-white  font-md   ${!isMonthly ? ' z-10 text-yellow-700  font-semibold' : ''}`}>Yearly</label>
          <div className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-white transition-transform duration-500 ease-in-out opacity-90 ${isMonthly ? '' : 'transform translate-x-full'}`}></div>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        {isMonthly && (
          <div className='flex flex-col items-center justify-between'>
            <form onSubmit={handleMonthlySummary} className='bg-gray-200 p-3 rounded-3xl shadow-xl flex flex-col justify-center'>
              <div>
                <label>Enter Month: </label>
                <select className='rounded-md border-black border-2' value={month} onChange={(e) => setMonth(e.target.value)}>
                  <option value="">Select a month</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <br />
              <div>
                <label>Enter Year:</label>
                <input
                  type="number"
                  name="year"
                  min="1900"
                  max="2099"
                  step="1"
                  value={year}
                  className='rounded-md border-black border-2'
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <br />
              <button type="submit" className='m-auto bg-blue-500 text-white rounded-xl p-2'>Get Statistics</button>
            </form>
            <Stat month_expenses={monthExpenses} year_expenses={yearExpenses} />
          </div>
        )}
        <div className="flex flex-col justify-center items-center">
          {!isMonthly && (
            <div className="flex flex-col justify-center items-center">
              <form onSubmit={handleYearlySummary} className='bg-gray-200 p-3  rounded-3xl shadow-xl flex flex-col justify-center items-center'>
                <div>
                  <label>Enter Year:</label>
                  <input
                    type="number"
                    name="year"
                    min="1900"
                    max="2099"
                    step="1"
                    value={year}
                    className='rounded-md border-black border-2'
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <br />
                <button type="submit" className=' bg-blue-500 text-white rounded-xl p-2' >Get Statistics</button>
              </form>
              <Graph year_expenses={yearExpenses}></Graph>
            </div>
          )
          }

        </div>
        <br />

      </div>
    </div>
  );
};

export default Home;
