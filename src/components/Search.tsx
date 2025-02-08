"use client"
import React, { useEffect, useState } from 'react'
import SearchIcon from './svg/SearchIcon'
import { usePathname, useRouter } from 'next/navigation'
import Sort from './svg/Sort'
import { useAppDispatch, useAppSelector } from '@/utils/hooks'
import { setDatasorting } from '@/redux/ReduxSlice'
import toast from 'react-hot-toast'
import Loader from '@/utils/Load'
import { ChangeGamesOrder } from '@/utils/action'
import Order from './svg/Order'



const Search = ({ page, platform }: any) => {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    })
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')


    const dispatch = useAppDispatch()
    const dragedData = useAppSelector((state) => state?.game?.dragedGameData)
    const pathname = usePathname()
    const router = useRouter()


    const handleSearch = () => {
        let queryParams = new URLSearchParams()
        queryParams.set('page', '1')

        if (search) queryParams.set('search', search)
        if (dateRange.startDate) queryParams.set("startDate", dateRange.startDate)
        if (dateRange.endDate) queryParams.set("endDate", dateRange.endDate)

        router.push(`${pathname}?${queryParams.toString()}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }


    const handleSort = () => {
        const newOrder = sortOrder === 'desc' ? 'asc' : 'desc'
        setSortOrder(newOrder)

        const queryParams = new URLSearchParams(window.location.search)
        queryParams.set('sort', newOrder)

        if (search) queryParams.set('search', search)
        if (dateRange.startDate) queryParams.set("startDate", dateRange.startDate)
        if (dateRange.endDate) queryParams.set("endDate", dateRange.endDate)

        router.push(`${pathname}?${queryParams.toString()}`)
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
        }
    }

    const clearFilters = () => {
        setSearch("")
        setDateRange({ startDate: "", endDate: "" })
        router.push(pathname)
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const urlSearch = params.get('search') || ''
        const urlStartDate = params.get('startDate') || ''
        const urlEndDate = params.get('endDate') || ''
        const urlSort = params.get('sort') as 'asc' | 'desc' || 'desc'

        setSearch(urlSearch)
        setDateRange({
            startDate: urlStartDate,
            endDate: urlEndDate
        })
        setSortOrder(urlSort)
    }, [])


    return (
        <div className='flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 w-full'>
            {/* Search Input */}
            <div className="w-full lg:w-1/3">
                <div className="relative h-11"> {/* Fixed height */}
                    <input
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        value={search}
                        className="h-full bg-gray-50 outline-none border-2 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-[#FFD117] w-full pl-4 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Search..."
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                    >
                        <SearchIcon />
                    </button>
                </div>
            </div>

            {page !== 'game' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                    {/* Date Range Filters */}
                    <div className="flex flex-wrap items-center gap-4 bg-gray-50 dark:bg-gray-700 px-4 py-2 sm:py-0 min-h-[2.75rem] rounded-lg border dark:border-gray-600">
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                className="bg-transparent text-sm outline-none dark:text-white w-[calc(50%-0.5rem)] sm:w-[130px]"
                            />
                            <span className="text-gray-400 hidden sm:inline">to</span>
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                className="bg-transparent text-sm outline-none dark:text-white w-[calc(50%-0.5rem)] sm:w-[130px]"
                            />
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto sm:pl-2 sm:border-l border-gray-200 dark:border-gray-600">
                            <button
                                onClick={handleSearch}
                                className="flex-1 sm:flex-none bg-[#FFD117] hover:bg-[#FFD117]/90 text-black px-3 py-1.5 rounded text-sm font-medium"
                            >
                                Apply
                            </button>
                            {(search || dateRange.startDate || dateRange.endDate) && (
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 px-3 py-1.5 rounded text-sm"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sort Button */}
                    <button
                        onClick={handleSort}
                        className="h-11 flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-4 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                    >
                        <Sort />
                        <span className="text-sm font-medium text-gray-700 dark:text-white">
                            {sortOrder === 'desc' ? 'Latest' : 'Oldest'}
                        </span>
                    </button>
                </div>
            )}

            {/* Game Order Button */}
            {page === 'game' && dragedData?.length > 0 && (
                <button
                    onClick={() => handelChangeOrder(dragedData)}
                    className="h-11 flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-4 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all ml-auto"
                >
                    <Order />
                    <span className="text-sm font-medium text-gray-700 dark:text-white">Update Order</span>
                </button>
            )}

            {loading && <Loader />}
        </div>
    )
}

export default Search
