"use client";
import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import Arrow_Left from "../svg/Arrow_Left";
import Arrow_Right from "../svg/Arrow_Right";
import { getGameHistory } from "@/utils/action";
import { SessionSpinChart } from "../SessionSpinChart";
import { TimeDisplay } from "./TimeDisplay";
import { StatsCard } from "./StatsCard";
import { WinPercentageChart } from "../WinPercentageChart";


const PlayerGameHistory = ({ username }: { username: string }) => {
    const [sessionData, setSessionData] = useState<any[]>([]);
    const [daterange, setDaterange] = useState<any>({
        startDate: "",
        endDate: "",
    });
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<any>({});
    const [exceldata, setExceldata] = useState<any[]>([]);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function formatDate(date: any) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    const currentDate = new Date();
    const prevDate = new Date();
    prevDate.setDate(currentDate.getDate() - 1);

    const handelDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        setDaterange((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleDateClick = (ref: React.RefObject<HTMLInputElement>) => {
        if (ref.current) {
            ref.current.showPicker();
        }
    };

    const getPlayerGameHistory = async (
        startDate: string,
        endDate: string,
        playerId: string,
        page: number
    ) => {
        try {
            setLoad(true);
            const { data, error } = await getGameHistory(
                startDate,
                endDate,
                playerId,
                page
            );



            if (error) {
                throw new Error(error);
            }

            console.log("PLAYER GAME HISTORY", data);

            setSessionData(data.sessionData);
            setPagination(data.pagination);
            setExceldata(data.excelData);

            setLoad(false);
        } catch (error) {
            setLoad(false);
            setError(
                error instanceof Error ? error.message : "An unexpected error occurred"
            );

            // Clear previous data when an error occurs
            setSessionData([]);
            setPagination({});
            setExceldata([]);
            setLoad(false);
        }
    };

    useEffect(() => {
        getPlayerGameHistory(
            daterange.startDate,
            daterange.endDate,
            username,
            currentPage
        );
    }, [currentPage, daterange.endDate]);

    useEffect(() => {
        if (daterange.startDate && daterange.endDate) {
            setError(null); // Clear any existing error when both dates are set
        }
    }, [daterange.startDate, daterange.endDate]);

    const handelGenerateExcelData = (daterange: any) => {
        getPlayerGameHistory(
            daterange?.startDate,
            daterange?.endDate,
            username,
            currentPage
        );
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage: any) => prevPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < pagination?.totalPages) {
            setCurrentPage((prevPage: any) => prevPage + 1);
        }
    };

    const downloadDataInExcel = (data: any) => {
        const rows = data.flatMap((item: any) =>
            item.gameSessions.map((session: any) => ({
                "Player Name": item?.playerId,
                "Manager Name": item?.managerName,
                "Initial Credit": item?.initialCredits,
                "Current Credit": item?.currentCredits,
                "Entry Time": new Date(session?.entryTime)?.toLocaleString(),
                "Exit Time": new Date(session?.exitTime)?.toLocaleString(),
                "Game Session ID": session?.gameId,
                "Game Duration": session?.sessionDuration,
                "Total Spins": session?.totalSpins,
                "Total Bet Amount": session?.totalBetAmount,
                "Total Win Amount": session?.totalWinAmount,
                "Credit At Entry": session?.creditsAtEntry,
                "Credit At Exit": session?.creditsAtExit,
            }))
        );

        const spinHistoryRows = data.flatMap((item: any) =>
            item.gameSessions.flatMap((session: any) =>
                session.spinData.map((spin: any) => ({
                    "Player Name": item?.playerId,
                    "Manager Name": item?.managerName,
                    "Game Session ID": session?.gameId,
                    "Bet Amount": spin?.betAmount,
                    "Win Amount": spin?.winAmount,
                }))
            )
        );

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows);

        XLSX.utils.book_append_sheet(workbook, worksheet, "GamesHistory");
        XLSX.utils.sheet_add_aoa(worksheet, [
            [
                "Player Name",
                "Manager Name",
                "Initial Credit",
                "Current Credit",
                "Game Entry Time",
                "Game Exit Time",
                "Game Id",
                "Game Duration",
                "Total Spins",
                "Total Bet Amount",
                "Total Win Amount",
                "Credit At Entry",
                "Credit At Exit",
            ],
        ]);

        const spinHistorySheet = XLSX.utils.json_to_sheet(spinHistoryRows);
        XLSX.utils.book_append_sheet(workbook, spinHistorySheet, "SpinHistory");
        XLSX.utils.sheet_add_aoa(spinHistorySheet, [
            [
                "Player Name",
                "Manager Name",
                "Game Session ID",
                "Bet Amount",
                "Win Amount",
            ],
        ]);

        XLSX.writeFile(workbook, `Report_of_${username}.xlsx`, {
            compression: true,
        });
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 rounded-xl shadow-2xl w-full mx-auto">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center w-full pb-3">
                <button
                    onClick={() => downloadDataInExcel(exceldata)}
                    disabled={sessionData.length === 0}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm lg:text-base font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"                >
                    Download
                </button>
                <div className="flex flex-col space-y-4 w-full md:w-auto md:ml-4">
                    <div className="flex flex-col md:flex-row items-center space-x-2">
                        <input
                            type="date"
                            ref={startDateRef}
                            value={daterange.startDate}
                            name="startDate"
                            onChange={(e) => handelDateChange(e)}
                            onClick={() => handleDateClick(startDateRef)}
                            className="w-full p-2 rounded-lg text-gray-800 border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300 ease-in-out shadow-sm bg-white focus:bg-white focus:outline-none appearance-none cursor-pointer"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 0.5rem center",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        />
                        <span className="text-gray-500 font-medium">to</span>
                        <input
                            type="date"
                            ref={endDateRef}
                            value={daterange.endDate}
                            name="endDate"
                            onChange={(e) => handelDateChange(e)}
                            onClick={() => handleDateClick(endDateRef)}
                            disabled={!daterange.startDate}
                            className="w-full p-2 rounded-lg text-gray-800 border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-300 ease-in-out shadow-sm bg-white focus:bg-white focus:outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 0.5rem center",
                                backgroundSize: "1.5em 1.5em",
                                paddingRight: "2.5rem",
                            }}
                        />
                    </div>
                    <div className="flex justify-center sm:justify-end space-x-2">
                        <button
                            onClick={() => handelGenerateExcelData(daterange)}
                            disabled={!daterange?.startDate || !daterange?.endDate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                            Get
                        </button>
                        <button
                            onClick={() => {
                                const newDateRange = { startDate: "", endDate: "" };
                                setDaterange(newDateRange);
                                if (!daterange.startDate && !daterange.endDate) {
                                    getPlayerGameHistory("", "", username, 1);
                                }
                            }}
                            disabled={!daterange.startDate && !daterange.endDate}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2 overflow-y-auto  pr-4 custom-scrollbar">
                {load ? (
                    <div className="fixed zindex top-0 left-0 w-full h-full">
                        <div className="w-full h-full relative  flex items-center justify-center">
                            <svg className="loader" viewBox="25 25 50 50">
                                <circle r="20" cy="50" cx="50"></circle>
                            </svg>
                        </div>
                    </div>
                ) : sessionData?.length > 0 ? (
                    sessionData?.map((platformSession, ind) => (
                        // Platform Session Data
                        <div key={ind} className="border border-gray-500 rounded-xl ">

                            <div className="p-4 flex flex-col space-y-4">
                                <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 ">
                                    <TimeDisplay label="Platform Entry" timestamp={platformSession?.entryTime} />
                                    <TimeDisplay label="Platform Exit" timestamp={platformSession?.exitTime} />
                                </div>

                                {platformSession?.gameSessions?.length > 0 && (
                                    <div className="bg-slate-800 rounded-lg p-4">
                                        <div className=" p-4">
                                            <h2 className=" text-xl text-white">Game Sessions</h2>
                                        </div>
                                        {platformSession?.gameSessions?.length > 0 && platformSession.gameSessions.map((gameSession: any, index: number) => {
                                            const chartData = gameSession.spinData.map((spin: any, index: number) => ({
                                                spin: index + 1,
                                                winPercentage: spin.betAmount > 0 ? (spin.winAmount / spin.betAmount) * 100 : 0,
                                                betAmount: spin.betAmount,
                                                winAmount: spin.winAmount,
                                            }));

                                            const totalWinPercentage: number = gameSession.spinData.reduce(
                                                (sum: number, spin: { betAmount: number; winAmount: number }) => sum + (spin.betAmount > 0 ? (spin.winAmount / spin.betAmount) * 100 : 0),
                                                0
                                            );

                                            const averageWinPercentage = gameSession.spinData.length > 0 ? totalWinPercentage / gameSession.spinData.length : 0;

                                            return (
                                                <div className=" bg-slate-700  p-4 rounded-lg flex flex-col gap-4">
                                                    <div className="grid grid-cols-1 p-4">
                                                        <h3 className="text-white text-xl font-bold"> #{index + 1}</h3>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        <StatsCard label="Game ID" value={gameSession.gameId} />
                                                        <StatsCard label="Game Name" value={gameSession.gameName} />
                                                        <StatsCard
                                                            label="Credits at Entry"
                                                            value={gameSession.creditsAtEntry.toLocaleString()}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <StatsCard label="Total Spins" value={gameSession.totalSpins} />
                                                        <StatsCard
                                                            label="Total Bet Amount"
                                                            value={gameSession.totalBetAmount.toFixed(3)}
                                                        />
                                                        <StatsCard
                                                            label="Total Win Amount"
                                                            value={gameSession.totalWinAmount.toFixed(3)}
                                                        />
                                                        <WinPercentageChart percentage={averageWinPercentage} />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <TimeDisplay label="Entry Time" timestamp={gameSession.entryTime} />
                                                        <TimeDisplay label="Exit Time" timestamp={gameSession.exitTime} />
                                                        <StatsCard
                                                            label="Credits at Exit"
                                                            value={gameSession.creditsAtExit.toLocaleString()}
                                                        />
                                                    </div>

                                                    <div>
                                                        <SessionSpinChart spinData={gameSession.spinData} />
                                                    </div>

                                                </div>
                                            )
                                        })}

                                    </div>
                                )}

                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center text-base sm:text-lg lg:text-xl">
                        {error}
                    </p>
                )}
            </div>

            {/* Pagination */}
            {sessionData?.length > 0 && (
                <div className="flex justify-end dark:text-white text-gray-600 pt-5  pr-2">
                    <div className="flex items-center transition-all space-x-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className={`dark:hover:text-[#FFD117] hover:text-[#FFD117] text-black dark:text-white ${currentPage === 1 ? "opacity-50" : ""
                                }`}
                        >
                            <Arrow_Left />
                        </button>
                        <span className="text-sm">Page</span>
                        <span className="text-[#FFD117]">{currentPage}</span>
                        <span className="text-sm">Of</span>
                        <span className="text-[#FFD117]">{pagination?.totalPages}</span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === pagination?.totalPages}
                            className={`dark:hover:text-[#FFD117] hover:text-[#FFD117] text-black dark:text-white ${currentPage === pagination?.totalPages ? "opacity-50" : ""
                                }`}
                        >
                            <Arrow_Right />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default PlayerGameHistory;
