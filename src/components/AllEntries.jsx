import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import editIcon from "../assets/penciledit.png";
import deleteIcon from "../assets/delete_icon.png";
import Search from './Search';
import Pagination from './Pagination';

const AllEntries = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [total, setTotal] = useState(0);
    const [textSearch, setTextSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [editingRow, setEditingRow] = useState(null);
    const [editedValues, setEditedValues] = useState({ entry_name: '', entry_amount: '', entry_type: '', date: '' });

    const navigate = useNavigate();
    const expensesPerPage = 5;

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const user_id = localStorage.getItem("user_id");
                if (!user_id) {
                    console.error('User ID not found in localStorage');
                    return;
                }

                const url = `https://money-matrix-backend.vercel.app/getExpenses`;

                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'user_id': user_id
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setExpenses(data);
                    setFilteredExpenses(data);

                } else {
                    console.error('Error fetching expenses:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, [textSearch]);

    const handleEditClick = (index) => {

        
        let calculatedIndex=(currentPage-1)*expensesPerPage + index;

        const expense = expenses[calculatedIndex];
        console.log("Edit exp:",expense);
        
        setEditingRow(calculatedIndex);
        setEditedValues({
            entry_name: expense.entry_name,
            entry_amount: expense.entry_amount,
            entry_type: expense.entry_type,
            date: expense.date
        });
    };

    
    const handleDelete = async (index) => {
        // Calculate the correct index based on currentPage and expensesPerPage
        let calculatedIndex = (currentPage - 1) * expensesPerPage + index;
        const expense = expenses[calculatedIndex];
        console.log("To be deleted:", expense);
    
        try {
            // Make the DELETE request to the server
            const response = await fetch('https://money-matrix-backend.vercel.app/deleteExpense', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    expense_id: expense.expense_id,
                    entry_id: expense.entry_id
                })
            });
    
            if (response.ok) { // Check if the response is successful
                const res_data = await response.json();
                console.log("Deleted response data:", res_data);
    
                // Assuming res_data.data contains the updated list of expenses
                const updatedExpenses = res_data.data;
                
                // Update the state with the remaining expenses
                setExpenses(updatedExpenses);
                setFilteredExpenses(updatedExpenses);
                window.location.reload();
            } else {
                console.error('Error deleting expense:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };
    


    const handleEditSave = async (index) => {
        let calculatedIndex=(currentPage-1)*expensesPerPage + index;
        const expenseToUpdate = { ...expenses[calculatedIndex], ...editedValues };

        try {
            const response = await fetch('https://money-matrix-backend.vercel.app/editExpense', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expenseToUpdate)
            });

            if (response.status === 200) {
                const res_data = await response.json();
                const updatedExpenses = expenses.map((expense, i) =>
                    i === calculatedIndex ? res_data.data : expense
                );

                setExpenses(updatedExpenses);
                setFilteredExpenses(updatedExpenses);
                setEditingRow(null);
            } else {
                console.error('Error updating expense:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    useEffect(() => {
        const totalAmount = filteredExpenses.reduce((sum, expense) => sum + (expense.entry_amount || 0), 0);
        setTotal(totalAmount);
    }, [filteredExpenses]);

    useEffect(() => {
        const filterExpenses = () => {
            if (textSearch.length === 10) {
                return expenses.filter(expense => expense.date && expense.date.slice(0, 10) === textSearch);
            } else if (textSearch.length === 7) {
                return expenses.filter(expense => expense.date && expense.date.slice(0, 7) === textSearch);
            } else if (textSearch.length === 4) {
                return expenses.filter(expense => expense.date && expense.date.slice(0, 4) === textSearch);
            } else {
                return expenses;
            }
        };

        const filtered = filterExpenses();
        setFilteredExpenses(filtered);
        const totalPages = Math.ceil(filtered.length / expensesPerPage);
        setTotalPages(totalPages);

        if (textSearch.length === 10) {
            const totalPages = Math.ceil(filtered.length / expensesPerPage);
            setTotalPages(totalPages);
        }
        else if (textSearch.length === 7) {
            const dailySummary = filtered.reduce((acc, expense) => {
                acc[expense.date.slice(0, 10)] = (acc[expense.date.slice(0, 10)] || 0) + 1;
                return acc;
            }, {});
            const dailyCount = Object.keys(dailySummary).length;
            setTotalPages(Math.ceil(dailyCount / expensesPerPage));
        }
        else if (textSearch.length === 4) {
            const monthlySummary = filtered.reduce((acc, expense) => {
                acc[expense.date.slice(0, 7)] = (acc[expense.date.slice(0, 7)] || 0) + 1;
                return acc;
            }, {});
            const monthlyCount = Object.keys(monthlySummary).length;
            setTotalPages(Math.ceil(monthlyCount / expensesPerPage));
        }
        else {
            const totalPages = Math.ceil(filtered.length / expensesPerPage);
            setTotalPages(totalPages);
        }

    }, [textSearch, expenses, currentPage]);

    const getPaginatedSummary = (summary) => {
        const startIndex = (currentPage - 1) * expensesPerPage;
        const endIndex = startIndex + expensesPerPage;

        return Object.entries(summary).slice(startIndex, endIndex);
    };

    const renderSummaryTable = (summary, label) => (
        <table className='table-auto w-1/2 rounded-2xl shadow-xl overflow-hidden'>
            <thead className='bg-gray-200'>
                <tr className='divide-x divide-white'>
                    <th className='p-2'>{label}</th>
                    <th className='p-2'>Amount Spent</th>
                </tr>
            </thead>
            <tbody className='bg-white'>
                {getPaginatedSummary(summary).map(([key, value], index) => (
                    <tr onClick={() => setTextSearch(key)} className='hover:bg-green-300' key={index}>
                        <td className='text-xl text-center shadow-md p-2 underline'>{key}</td>
                        <td className='text-xl text-center shadow-md p-2'>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderMonthlySummary = () => {
        const dailySummary = filteredExpenses.reduce((acc, expense) => {
            const day = expense.date ? expense.date.slice(0, 10) : ''; // YYYY-MM-DD
            acc[day] = (acc[day] || 0) + (expense.entry_amount || 0);
            return acc;
        }, {});

        return renderSummaryTable(dailySummary, 'Date');
    };

    const renderYearlySummary = () => {
        const monthlySummary = filteredExpenses.reduce((acc, expense) => {
            const month = expense.date ? expense.date.slice(0, 7) : ''; // YYYY-MM
            acc[month] = (acc[month] || 0) + (expense.entry_amount || 0);
            return acc;
        }, {});

        return renderSummaryTable(monthlySummary, 'Month');
    };

    const renderExpensesTable = (expenses) => {

        const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * expensesPerPage, currentPage * expensesPerPage);

        return (
            <table className='table-auto w-1/2 rounded-2xl shadow-xl overflow-hidden'>
                <thead className='bg-gray-200'>
                    <tr className='divide-x divide-white'>
                        <th className='p-2'>Expense Name</th>
                        <th className='p-2'>Amount Spent</th>
                        <th className='p-2'>Expense Type</th>
                        <th className='p-2'>Spent On</th>
                        <th className='p-2'>Edit</th>
                        <th className='p-2'>Delete</th>
                    </tr>
                </thead>
                <tbody className='bg-white'>
                {paginatedExpenses.map((expense, index) => {
                    const calculatedIndex = (currentPage - 1) * expensesPerPage + index;

                    return (
                        <tr key={index}>
                            <td className='text-xl text-center shadow-md p-2'>
                                {editingRow === calculatedIndex ? ( // Compare with overall index
                                    <input
                                        type="text"
                                        name="entry_name"
                                        value={editedValues.entry_name}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    expense.entry_name
                                )}
                            </td>
                            <td className='text-xl text-center shadow-md p-2'>
                                {editingRow === calculatedIndex ? ( // Compare with overall index
                                    <input
                                        type="number"
                                        name="entry_amount"
                                        value={editedValues.entry_amount}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    expense.entry_amount
                                )}
                            </td>
                            <td className='text-xl text-center shadow-md p-2'>
                                {editingRow === calculatedIndex ? ( // Compare with overall index
                                    <select name="entry_type" value={editedValues.entry_type} onChange={handleChange}>
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
                                ) : (
                                    expense.entry_type
                                )}
                            </td>
                            <td className='text-xl text-center shadow-md p-2'>
                                {editingRow === calculatedIndex ? ( // Compare with overall index
                                    <input
                                        type="text"
                                        name="date"
                                        value={editedValues.date}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    expense.date ? expense.date.slice(0, 10).split("-").reverse().join("/") : 'N/A'
                                )}
                            </td>
                            <td className='text-xl text-center shadow-md p-2'>
                                {editingRow === calculatedIndex ? ( // Compare with overall index
                                    <button className='text-white bg-blue-500 rounded-full p-1' onClick={() => handleEditSave(index)}>Save</button>
                                ) : (
                                    <img src={editIcon} alt="edit" className='h-6 w-6 cursor-pointer' onClick={() => handleEditClick(index)} />
                                )}
                            </td>
                            <td className='text-xl text-center shadow-md p-2'>
                                <img src={deleteIcon} alt="delete" className='h-6 w-6 cursor-pointer' onClick={()=>handleDelete(index)} />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

    const move = () => {
        navigate("/entry");
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
                <br />
                <button onClick={move} className='p-3 bg-red-300 rounded-3xl font-semibold'>Add Expense</button>
            </div>
        </div>
    );
};

export default AllEntries;
