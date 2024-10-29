"use client"
import React, { useEffect, useState } from 'react'
import Recharge from './svg/Recharge'
import Redeem from './svg/Redeem'
import Clients from './svg/Clients'
import Player from './svg/Player'
import RecentTransaction from './RecentTransaction'
import { getUserReport } from '@/utils/action'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import TodayDate from './svg/Date'
import { formatAmount } from '@/utils/common'
import { useAppSelector } from '@/utils/hooks'
import Percentage from './svg/Percentage'

const Dashboard = ({ subordinates_id, userDetail }: any) => {
    const [reporttype, setReportType] = useState('daily')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>({});
    const date = new Date()?.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    const userCredit = useAppSelector((state) => state?.user?.userCredit)
    const card = data?.role === 'player' ? [
        {
            title: 'Recharge',
            amount: formatAmount(data?.recharge || 0),
            icon: <Recharge />
        },
        {
            title: 'Redeem',
            amount: formatAmount(data?.redeem || 0),
            icon: <Redeem />
        },
    ] : subordinates_id && data?.role !== 'player' ? [{
        title: 'Recharge',
        amount: formatAmount(data?.recharge || 0),
        icon: <Recharge />
    },
    {
        title: 'Redeem',
        amount: formatAmount(data?.redeem || 0),
        icon: <Redeem />
    }, {
        title: 'Clients',
        amount: data?.users ? Object?.values(data?.users)?.reduce((acc: any, value: any) => acc + value, 0) : 0,
        icon: <Clients />
    },
    {
        title: 'Date',
        amount: data?.users ? date : 0,
        icon: <TodayDate />
    }
    ] : data?.role === "company" ? [
        {
            title: 'Recharge',
            amount: formatAmount(data?.recharge || 0),
            icon: <Recharge />
        },
        {
            title: 'Redeem',
            amount: formatAmount(data?.redeem || 0),
            icon: <Redeem />
        },
        {
            title: 'Clients',
            amount: data?.users ? Object?.values(data?.users)?.reduce((acc: any, value: any) => acc + value, 0) : 0,
            icon: <Clients />
        },
        {
            title: 'Players',
            amount: data?.users?.player,
            icon: <Player />
        }
    ] : [
        {
            title: 'Recharge',
            amount: formatAmount(data?.recharge || 0),
            icon: <Recharge />
        },
        {
            title: 'Redeem',
            amount: formatAmount(data?.redeem || 0),
            icon: <Redeem />
        },
        {
            title: 'Clients',
            amount: data?.users ? Object?.values(data?.users)?.reduce((acc: any, value: any) => acc + value, 0) : 0,
            icon: <Clients />
        },
        {
            title: 'Holdings %',
            amount: `${userCredit && data?.recharge > 0 ? (Math.round((userCredit / userDetail?.data?.totalRecharged) * 100)) : 0}%`,
            icon: <Percentage />
        }
    ]

    useEffect(() => {
        (async () => {
            setLoading(true);
            const user: any = await Cookies.get('userToken')
            if (user) {
                const userid: any = jwt.decode(user)
                const response = await getUserReport(subordinates_id ? subordinates_id : userid?.id, reporttype);
                setLoading(false);
                if (response?.error) {
                    return toast.error(response.error);
                }
                setData(response);
            }
        })();
    }, [reporttype, subordinates_id]);

    return (
        <div className='py-2'>
            <div className='px-2 h-full bg-gray-100 rounded dark:bg-gray-800'>
                <div className='flex items-center justify-between'>
                    <div className=' dark:text-white text-[1.2rem] capitalize'>{reporttype} Report</div>
                    <div className='pt-2'>
                        <select onChange={(e) => setReportType(e.target.value)} className='px-8 bg-gray-300 rounded-md dark:bg-gray-700 outline-none dark:text-white text-black py-1.5'>
                            <option value="daily">Daily</option>
                            <option value="weakly">Weakly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                </div>
                <div className='grid grid-cols-12 pt-5 gap-4'>
                    {
                        loading ? Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg bg-gray-300 dark:bg-gray-700 h-[143px] animatepulse col-span-6 lg:col-span-4 xl:col-span-3"
                            ></div>
                        )) :
                            card?.map((item, ind) => (
                                <div key={ind} className='p-4 rounded-lg bg-white dark:bg-gray-700 col-span-6 lg:col-span-4 xl:col-span-3'>
                                    <div className='flex justify-start space-x-2 items-center'>
                                        {item?.icon}
                                        <div className='dark:text-white text-xl text-black'>{item?.title}</div>
                                    </div>
                                    <div className={`text-5xl text-transparent bg-clip-text bg-gradient-to-tr from-[#F08D36] to-[#FFD117] pt-4 ${item?.title === 'Date' && 'text-[1.4rem] lg:text-[2rem]'}`}>{item?.amount}</div>
                                </div>
                            ))
                    }
                </div>


                <div className='pt-5 pb-3 grid grid-cols-12 gap-4 h-full'>
                    <RecentTransaction recentTransactions={data?.transactions} />
                    <div className='col-span-12 lg:col-span-5 p-3 rounded-lg  bg-white dark:bg-gray-700 '>
                        <div className='text-xl dark:text-white'>Most Played Games</div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard
