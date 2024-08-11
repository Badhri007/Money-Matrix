import React, { useState, useEffect, useRef } from 'react';
import { DonutChart } from './DonutChart';

const Stat = ({ month_expenses, year_expenses }) => {
    const [total, setTotal] = useState(0);
    const [expenseTypeTotal, setExpenseTypeTotal] = useState([]);
    const chartRef = useRef();

    useEffect(() => {
        let calculatedTotal = 0;
        const expenseTypeMap = {};

        month_expenses.forEach((expense) => {
            expense.entry.forEach((entry) => {
                calculatedTotal += entry.amount;
                let expense_type = entry.expense_type;

                if (expenseTypeMap[expense_type]) {
                    expenseTypeMap[expense_type] += entry.amount;
                } else {
                    expenseTypeMap[expense_type] = entry.amount;
                }
            });
        });

        setTotal(calculatedTotal);
        setExpenseTypeTotal(Object.entries(expenseTypeMap).map(([key, value]) => ({ name: key, value })));
    }, [month_expenses]);

    return (
        <div className='flex my-0 flex-row w-3/4 items-center justify-between  h-[50vh] m-2 rounded-3xl' >
            <div className='mx-3'>
                <br/>
            <DonutChart width={600} height={350} total={total} data={expenseTypeTotal} />
            </div>
            <div className="pr-20">
                { total > 0 && (
                <>
                <h2>Total Monthly Expense: {total}</h2>
                <h2>Expense by Type</h2>
                <ul>
                    {expenseTypeTotal.map((expense, index) => (
                        <li key={index}>{`${expense.name}: ${expense.value}`}</li>
                    ))}
                </ul>
                </>
                )
                }
            </div>
        </div>
    );
};

export default Stat;
