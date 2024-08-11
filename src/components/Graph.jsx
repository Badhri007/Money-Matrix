import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const Graph = ({ year_expenses }) => {
  const [total, setTotal] = useState(0);
  const [year, setYear] = useState('');
  const [monthExpense, setMonthExpense] = useState({});

  useEffect(() => {
    let calcTotal = 0;
    let y = '';
    let monthMap = {};
    year_expenses.forEach((expense) => {
      y = expense.date.slice(0, 4);
      const month = expense.date.slice(5, 7);
      console.log('Month Extracted:', month);
      expense.entry.forEach((entri) => {
        calcTotal += entri.amount;
        monthMap[month] = (monthMap[month] || 0) + entri.amount;
      });
    });
    setTotal(calcTotal);
    setYear(y);
    setMonthExpense(monthMap);
  }, [year_expenses]);

  const ordered = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return monthExpense[month] || 0;
  });

  const xLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
  ];

  return (
    <div>
      <br />
      <LineChart
        width={700}
        height={350}
        grid={{ horizontal: true }}
        series={[
          { data: ordered, label: `${year} Expenses`,
          area: true
         },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
      />
    </div>
  );
};

export default Graph;
