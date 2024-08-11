    import React,{useState} from 'react'

    const Search = ({textSearch,setTextSearch}) => {

    const [searchData,setSearchData]=useState(
        {
            searchQuery:''
        }
    )
    

    const handleChanges = (event) => {
        const { name, value } = event.target;
        setSearchData((prevData) => ({
        ...prevData,
        [name]: value
        }));
    };


    // const handleSubmit=async(event)=>
    // {
    //     event.preventDefault();
    //     // console.log("Entered value:",searchData['searchQuery']);
    //     let input_date=searchData['searchQuery']
    //     input_date=input_date.split("/").reverse().join('-')
    //     // console.log(input_date);
    //     setTextSearch(input_date);
    // }

    return (
        <div className='flex flex-col justify-center items-center'>
            <h3 className='text-2xl font-semibold mb-2'>Search Expenses...</h3>
            <div className='flex flex-col items-center  p-3 rounded-2xl mt-2 w-2/3 h-50'>
                
                {/* <div className='flex flex-row gap-4'> */}
                <input type="text" name="searchQuery" onChange={(e) => setTextSearch(e.target.value)} className=" w-3/4 h-10 rounded-3xl p-3 shadow-black-400 shadow-lg" value={textSearch} placeholder="Search by date (YYYY-MM-DD), month (YYYY-MM), or year (YYYY)" />
                <br/>
                {/* <button onClick={handleSubmit} className=' p-2 mb-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md'>Search</button> */}
                {/* </div> */}
            </div>
        </div>
    )
    }

    export default Search