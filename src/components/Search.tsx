"use client"
import React, { useState } from 'react'
import SearchIcon from './svg/SearchIcon'
import { usePathname, useRouter } from 'next/navigation'

const Search = () => {
    const [search, setSearch] = useState('')
    const pathname = usePathname()
    const router=useRouter()
    const handelSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
       router.push(`${pathname}?page=1&search=${search}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handelSearch(e)
        }
    }

    return (
        <div className="flex items-center w-[96%] mx-auto lg:mx-0 lg:w-[50%]">
            <label className="sr-only">Search</label>
            <div className="relative w-full">
                <input 
                    onChange={(e) => setSearch(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    type="text" 
                    className="bg-gray-50 outline-none border-[2px] text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-[#FFD117] block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#FFD117] dark:focus:border-[#FFD117]" 
                    placeholder="Search..." 
                    required 
                />
                <button 
                    type="button" 
                    onClick={(e) => handelSearch(e)} 
                    className="absolute inset-y-0 end-0 flex items-center pr-3"
                >
                    <SearchIcon />
                </button>
            </div>
        </div>
    )
}

export default Search
