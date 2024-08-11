import React, { useEffect, useState } from 'react';
import Search from './Search';
import { useNavigate } from 'react-router-dom';

const AllEntries = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [total, setTotal] = useState(0);
    const [textSearch, setTextSearch] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const user_id = localStorage.getItem("user_id");
                if (!user_id) {
                    console.error('User ID not found in localStorage');
                    return;
                }

                const url = 'https://money-matrix-frontend.vercel.app/getExpenses';
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'user_id': user_id
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("Got data:", data);
                    setExpenses(data);
                    setFilteredExpenses(data);
                } else {
                    console.error('Error fetching expenses');
                }
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, []);

    useEffect(() => {
        const totalAmount = filteredExpenses.reduce((sum, expense) => {
            return sum + expense.entry.reduce((entrySum, entri) => entrySum + entri.amount, 0);
        }, 0);
        setTotal(totalAmount);
    }, [filteredExpenses]);
    

    useEffect(() => {
        if (textSearch.length === 10) {
            const filtered = expenses.filter(expense => expense.date.slice(0, 10) === textSearch);
            setFilteredExpenses(filtered);
        } else if (textSearch.length === 7) {
            const filtered = expenses.filter(expense => expense.date.slice(0, 7) === textSearch);
            setFilteredExpenses(filtered);
        } else if (textSearch.length === 4) {
            const filtered = expenses.filter(expense => expense.date.slice(0, 4) === textSearch);
            setFilteredExpenses(filtered);
        } else {
            setFilteredExpenses(expenses);
        }
    }, [textSearch, expenses]);

    const renderSummaryTable = (summary, label) => (
        <table className='table-auto w-1/2 rounded-2xl shadow-xl overflow-hidden'>
            <thead className='bg-gray-200'>
                <tr className='divide-x divide-white'>
                    <th className='p-2'>{label}</th>
                    <th className='p-2'>Amount Spent</th>
                </tr>
            </thead>
            <tbody className='bg-white'>
                {Object.keys(summary).map((key, index) => (
                    <tr onClick={() => setTextSearch(key)} className='hover:bg-green-300' key={index}>
                        <td className='text-xl text-center shadow-md p-2 underline'>{key}</td>
                        <td className='text-xl text-center shadow-md p-2'>{summary[key]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderMonthlySummary = () => {
        const dailySummary = {};

        filteredExpenses.forEach(expense => {
            const day = expense.date.slice(0, 10); // YYYY-MM-DD
            if (!dailySummary[day]) {
                dailySummary[day] = 0;
            }
            expense.entry.forEach(entri=>{
                dailySummary[day] += entri.amount;
            })
        });

        return renderSummaryTable(dailySummary, 'Date');
    };

    const renderYearlySummary = () => {
        const monthlySummary = {};

        filteredExpenses.forEach(expense => {
            const month = expense.date.slice(0, 7); // YYYY-MM
            if (!monthlySummary[month]) {
                monthlySummary[month] = 0;
            }

            expense.entry.forEach(entri=>{
                monthlySummary[month] += entri.amount;
            })
           
        });

        return renderSummaryTable(monthlySummary, 'Month');
    };

    const renderExpensesTable = (expenses) => (
        <table className='table-auto w-1/2 rounded-2xl shadow-xl overflow-hidden'>
            <thead className='bg-gray-200'>
                <tr className='divide-x divide-white'>
                    <th className='p-2'>Expense Name</th>
                    <th className='p-2'>Amount Spent</th>
                    <th className='p-2'>Expense Type</th>
                    <th className='p-2'>Spent On</th>
                </tr>
            </thead>
            <tbody className='bg-white'>
                {expenses.map((expense, index) => (
                    expense.entry.map((entri, ind) => (
                        <tr key={ind}>
                            <td className='text-xl text-center shadow-md p-2'>{entri.name}</td>
                            <td className='text-xl text-center shadow-md p-2'>{entri.amount}</td>
                            <td className='text-xl text-center shadow-md p-2'>{entri.expense_type}</td>
                            <td className='text-xl text-center shadow-md p-2'>{expense.date.slice(0, 10).split("-").reverse().join("/")}</td>
                        </tr>
                    ))
                ))}
            </tbody>
        </table>
    );

    const move = () => {
        navigate('/entry');
    };

    return (
        <div className="p-10 bg-gray-100">
            <Search textSearch={textSearch} setTextSearch={setTextSearch} />
            <br />
            <div className="flex items-center flex-col">
                <h1 className='text-2xl'>Total Expenditure: ${total}</h1>
                <br />
                {textSearch.length === 10 ? (
                    renderExpensesTable(filteredExpenses)
                ) : textSearch.length === 7 ? (
                    renderMonthlySummary()
                ) : textSearch.length === 4 ? (
                    renderYearlySummary()
                ) : (
                    renderExpensesTable(filteredExpenses)
                )}
                <br />
                <button onClick={move} className='p-3 block bg-red-300 rounded-3xl font-semibold'>Add Expense</button>
            </div>
        </div>
    );
};

export default AllEntries;
