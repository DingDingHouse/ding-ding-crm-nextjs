import { useSocket } from '@/socket/SocketProvider';
import React, { useEffect, useState } from 'react'
import Close from '../svg/Close';
import Filter from '../svg/Filter';

const GetPlayerGameHistory = ({ username, closeModal }: any) => {
    const { socket } = useSocket();
    const [sessionData, setSessionData] = useState<any[]>([]);
    const [entryDate, setEntryDate] = useState<string>("");
    const [showFilter, setShowFilter] = useState(false)
    const getPlayerSession = (username: string) => {
        socket?.emit(
            "data",
            {
                action: "PLAYER_SESSION",
                payload: { playerId: username },
            },
            (response: {
                success: boolean;
                message: string;
                sessionData?: any[];
            }) => {
                if (response.success && response.sessionData) {
                    setSessionData(response.sessionData);
                } else {
                    console.error("Failed to retrieve session data:", response.message);
                }
            }
        );
    };

    useEffect(() => {
        getPlayerSession(username)
    }, [username])

    return (
        <div className='relative'>
            <div className='relative'>
                <button onClick={() => setShowFilter(!showFilter)} className='dark:text-white text-gray-700'><Filter /></button>
                <select onChange={(e) => setEntryDate(e?.target?.value)} className={`top-[100%] ${showFilter ? 'scale-100' : 'scale-0'} transition-all left-0 absolute p-2 rounded-md text-black overflow-y-auto dark:text-white bg-gray-200 dark:bg-gray-400 outline-none `}>
                    <option value={''}>Select Date</option>

                    {
                        sessionData?.map((item) => (
                            item?.gameSessions?.map((subitem: any) => (
                                <>
                                    <option value={subitem?.entryTime}>{new Date(subitem?.entryTime).toLocaleString()}</option>
                                </>
                            ))

                        ))
                    }
                </select>
            </div>
            <h3 className="text-xl font-bold capitalize text-center text-gray-600 dark:text-white mb-4">
                Player Game History
            </h3>
            <button onClick={() => closeModal()} className='absolute -top-2 right-0'><Close /></button>
            <div className="space-y-5">
                {sessionData?.length > 0 ? sessionData?.map((item, ind) => (
                    <div key={ind} className="space-y-5">
                        {
                            item?.gameSessions?.filter((subitem: any) => entryDate ? subitem.entryTime === entryDate : true).map((subitem: any, index: number) => (

                                <div key={index} className="rounded space-y-5 bg-gray-100 dark:bg-gray-600 p-2">
                                    <div className="flex items-center  flex-wrap gap-2">
                                        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-black dark:text-white">Game Id : </span>
                                                <span className="text-gray-700 dark:text-gray-300">{subitem?.gameId}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-black dark:text-white">Credits at Entry : </span>
                                                <span className="text-gray-700 dark:text-gray-300">{subitem?.creditsAtEntry}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-black dark:text-white">Total Spins : </span>
                                                <span className="text-gray-700 dark:text-gray-300">{subitem?.totalSpins}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-black dark:text-white">Total Bet Amount : </span>
                                                <span className="text-gray-700 dark:text-gray-300">{subitem?.totalBetAmount}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-black dark:text-white">Total Win Amount : </span>
                                                <span className="text-gray-700 dark:text-gray-300">{subitem?.totalWinAmount}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-black dark:text-white">Game Session : </span>
                                                <span className="text-gray-700 dark:text-gray-300">{subitem?.sessionDuration}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-black dark:text-white">Entry Time : </span>
                                                <span className="text-gray-700 dark:text-gray-300">{new Date(subitem?.entryTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold text-black dark:text-white">Exit Time : </span>
                                                <span className="text-gray-700 dark:text-gray-300">{new Date(subitem?.exitTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4  dark:text-gray-50">
                                        <div className={subitem?.spinData?.length == 0 ? 'hidden' : 'block'}>Spin Data :</div>
                                        <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                                            {subitem?.spinData?.length > 0 ?
                                                subitem?.spinData?.map((spin: any, index: number) => (
                                                    <li key={index} className="bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 p-2 rounded-md">
                                                        Bet: {spin.betAmount}, Win: {spin.winAmount}
                                                    </li>
                                                )) : <span></span>}
                                        </ul>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                ))
                    : (
                        <p className="text-gray-400 text-center">No active game details available.</p>
                    )}
            </div>
        </div>

    )
}

export default GetPlayerGameHistory
