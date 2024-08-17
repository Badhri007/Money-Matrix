import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    

    return (
        <div className='flex justify-center mt-4'>
            {pages.map((page) => (
                <button
                    key={page}
                    className={`px-3 py-1 mx-1 rounded-full ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={()=>{handlePageChange(page)}}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
