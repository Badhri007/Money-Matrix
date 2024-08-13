import React, { useEffect, useState } from 'react';
import Search from './Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllEntries = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [total, setTotal] = useState(0);
    const [textSearch, setTextSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const user_id = localStorage.getItem("user_id");
                if (!user_id) {
                    console.error('User ID not found in localStorage');
                    return;
                }

                const url = `https://money-matrix-frontend.vercel/getExpensesPagination?page=${currentPage}&pageSize=4`;
                const res = await axios.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'user_id': user_id
                    }
                });

                if (res.status === 200) {
                    const { entries, totalPages } = res.data;

                    setExpenses(entries);
                    setFilteredExpenses(entries);
                    setTotalPages(totalPages);
                } else {
                    console.error('Error fetching expenses');
                }
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, [currentPage]);

    useEffect(() => {
        const totalAmount = filteredExpenses.reduce((sum, expense) => {
            return sum + (expense.amount || 0);
        }, 0);
        setTotal(totalAmount);
    }, [filteredExpenses]);

    useEffect(() => {
        if (textSearch.length === 10) {
            const filtered = expenses.filter(expense => expense.date && expense.date.slice(0, 10) === textSearch);
            setFilteredExpenses(filtered);
        } else if (textSearch.length === 7) {
            const filtered = expenses.filter(expense => expense.date && expense.date.slice(0, 7) === textSearch);
            setFilteredExpenses(filtered);
        } else if (textSearch.length === 4) {
            const filtered = expenses.filter(expense => expense.date && expense.date.slice(0, 4) === textSearch);
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
            const day = expense.date ? expense.date.slice(0, 10) : ''; // YYYY-MM-DD
            if (!dailySummary[day]) {
                dailySummary[day] = 0;
            }
            dailySummary[day] += expense.amount || 0;
        });

        return renderSummaryTable(dailySummary, 'Date');
    };

    const renderYearlySummary = () => {
        const monthlySummary = {};

        filteredExpenses.forEach(expense => {
            const month = expense.date ? expense.date.slice(0, 7) : ''; // YYYY-MM
            if (!monthlySummary[month]) {
                monthlySummary[month] = 0;
            }
            monthlySummary[month] += expense.amount || 0;
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
                    <tr key={index}>
                        <td className='text-xl text-center shadow-md p-2'>{expense.entry_name}</td>
                        <td className='text-xl text-center shadow-md p-2'>{expense.entry_amount}</td>
                        <td className='text-xl text-center shadow-md p-2'>{expense.entry_type}</td>
                        <td className='text-xl text-center shadow-md p-2'>{expense.date ? expense.date.slice(0, 10).split("-").reverse().join("/") : 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const move = () => {
        navigate('/entry');
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
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
                <div className="flex justify-between w-1/2">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className='p-3 bg-blue-300 rounded-3xl font-semibold'>Previous Page</button>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className='p-3 bg-blue-300 rounded-3xl font-semibold'>Next Page</button>
                </div>
                <br />
                <button onClick={move} className='p-3 bg-red-300 rounded-3xl font-semibold'>Add Expense</button>
            </div>
        </div>
    );
};

export default AllEntries;
