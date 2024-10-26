import React from 'react'
import SearchIcon from './svg/SearchIcon'
const Search = () => {
    return (
        <form className="flex items-center w-[96%] mx-auto lg:mx-0 lg:w-[50%]">
            <label className="sr-only">Search</label>
            <div className="relative w-full">
                <input type="text" className="bg-gray-50 outline-none ring-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required />
                <div className="absolute inset-y-0 end-0 flex items-center pr-3 pointer-events-none">
                    <SearchIcon/>
                </div>
            </div>
        </form>
    )
}

export default Search
