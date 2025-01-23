"use client"
import React, { useState } from 'react'
import SearchIcon from './svg/SearchIcon'
import { usePathname, useRouter } from 'next/navigation'
import Sort from './svg/Sort'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { setDatasorting } from '@/redux/ReduxSlice'
import Order from './svg/Order'
import { ChangeGamesOrder } from '@/utils/action'
import toast from 'react-hot-toast'
import { setDragedData } from '@/redux/gameorder/gameorderSlice'
import Loader from '@/utils/Load'



const Search = ({ page, platform }: any) => {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    const dispatch = useAppDispatch()
    const sort = useAppSelector((state) => state?.globlestate?.isDataSorting)
    const dragedData = useAppSelector((state) => state?.game?.dragedGameData)
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

    const handelSort = () => {
        dispatch(setDatasorting(!sort))
        setSearch('')
    }

    const handelChangeOrder = async (dragedData: any) => {
        setLoading(true)

        const formattedData = {
            gameOrders: dragedData?.map((game: any) => ({
                gameId: game._id,
                order: game.order
            })),
            platformName: platform
        };

        try {
            const response = await ChangeGamesOrder(formattedData)
            if (response.data?.message) {
                toast.success(response.data?.message)
            } else {
                toast.error(response.error || "An unexpected error occurred")
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message || "An error occurred")
            } else {
                toast.error("An error occurred")
            }
            console.log(error)
        } finally {
            setLoading(false)
            dispatch(setDragedData([]))
        }
    }

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
            {page !== 'game' && <div className='text-white relative'>
                <button onClick={handelSort} className='bg-white bg-opacity-15 px-3 py-1.5 rounded-md shadow-inner hover:scale-90 transition-all'><Sort /></button>
            </div>}
            {page === 'game' && dragedData?.length > 0 && <div className='text-white relative'>
                <button onClick={() => handelChangeOrder(dragedData)} className='test bg-white bg-opacity-15 px-3 py-1.5 rounded-md shadow-inner hover:scale-90 transition-all'>
                    <Order />
                </button>
            </div>}
            {loading && <Loader />}
        </div>
    )
}

export default Search
