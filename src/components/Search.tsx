"use client"
import React, { useEffect, useState } from 'react'
import SearchIcon from './svg/SearchIcon'
import { usePathname, useRouter } from 'next/navigation'
import Sort from './svg/Sort'

const Search = () => {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const handelSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>) => {
        router.push(`${pathname}?page=1&search=${search}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handelSearch(e)
        }
    }

    const handelSort = (sort: string) => {
        router.push(`${pathname}?page=1&sort=${sort}`)
        setSearch('')
    }

    useEffect(() => {
        handelSort(sort ? 'desc' : 'asc')
    }, [sort])

    return (
        <div className='flex items-center gap-x-5'>
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
            <div className='text-white relative'>
                <button onClick={() => setSort(!sort)} className='bg-white bg-opacity-15 px-3 py-1.5 rounded-md shadow-inner hover:scale-90 transition-all'><Sort /></button>
            </div>
        </div>
    )
}

export default Search
