import React from 'react';

const Navbar = () => {
    const navStyles = 'flex text-lg justify-center gap-x-10 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-roboto shadow-md h-14 items-center rounded-b-lg';
    const linkStyles = 'px-4 py-2 rounded transition duration-300 hover:bg-blue-800 hover:shadow-lg';

    const user_id = localStorage.getItem("user_id");
            if (!user_id) {
                console.error('User ID not found in localStorage');
                return (
                    <nav className={navStyles}>
                        <a href="/home" className={linkStyles}>Home</a>
                        <a href="#" className={linkStyles}>Profile</a>
                        <a href="/entry" className={linkStyles}>Entry</a>
                        <a href="/allEntries" className={linkStyles}>All Expenses</a>
                        <a href="/signup" className={linkStyles}>Signup</a>
                        <a href="/login" className={linkStyles}>Login</a>
                    </nav>
                );
            }

            else{
                return (
                    <nav className={navStyles}>
                        <a href="/home" className={linkStyles}>Home</a>
                        <a href="#" className={linkStyles}>Profile</a>
                        <a href="/entry" className={linkStyles}>Entry</a>
                        <a href="/allEntries" className={linkStyles}>All Expenses</a>
                        <a href="#" className={linkStyles}>Logout</a>
                    </nav>
                );
            };
            }
   

export default Navbar;
