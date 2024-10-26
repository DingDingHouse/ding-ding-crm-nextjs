import React from 'react'
import Down from './svg/Down'
import Up from './svg/Up'

const RecentTransaction = ({ recentTransactions }: any) => {
    return (
        <div className='col-span-12 lg:col-span-7 p-3 rounded-lg  bg-white dark:bg-gray-700 '>
            <div className="text-black px-6 tracking-wide text-[1.2rem]  py-2 m-3 dark:text-white dark:bg-onDark bg-light_black rounded-3xl inline-block">
                Recent Transactions
            </div>
            {/* Transaction Table */}
            <div className='w-full'>
                <div className="h-full relative  rounded-3xl">
                    {recentTransactions?.map((item: any, index: any) => (
                        <div key={index}>
                            <div className="flex  justify-between  bg-gray-100 dark:bg-gray-600 rounded-lg transition-all my-1  dark:border-black pb-3 lg:mx-4 pt-8 px-1 md:px-8">
                                <div className="flex space-x-2   w-full md:space-x-4">
                                    {item?.type === "redeem" ? <Down /> : <Up />}
                                    <div className='w-full'>
                                        <div className='flex items-center w-full   justify-between'>
                                            <div className="text-[.8rem] md:text-[1rem] dark:text-white text-black tracking-widest capitalize">
                                                {item?.type}
                                            </div>
                                            <div className="text-sm text-black text-opacity-60  dark:text-[#A0AEC0]">
                                                <span>{item?.type === "redeem" ? "-" : "+"}</span>
                                                {item?.amount}
                                            </div>
                                        </div>
                                        <div className="flex items-center pt-3 space-x-1 md:space-x-2">
                                            <div className="bg-dark_light_black dark:bg-onDark   py-1 flex items-center rounded-[.3rem] space-x-1 md:space-x-4">
                                                <span className="dark:text-white dark:text-opacity-70 text-[#9FA1A2]  text-[.8rem] ">
                                                    Sender
                                                </span>
                                                <span className="dark:text-white text-black  text-[.7rem] ">
                                                    {item?.debtor}
                                                </span>
                                            </div>
                                            <div className="bg-dark_light_black dark:bg-onDark  px-2 py-1 flex items-center rounded-[.3rem] space-x-1 md:space-x-4">
                                                <span className="dark:text-white text-[#9FA1A2] dark:text-opacity-70 text-[.8rem]">
                                                    Receiver
                                                </span>
                                                <span className="dark:text-white text-black  text-[.7rem]">
                                                    {item?.creditor}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="dark:text-white text-black text-xs font-extralight dark:text-opacity-30 pt-2">
                                            {new Date(item?.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    )
}

export default RecentTransaction
