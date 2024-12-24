"use client";
import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import Arrow_Left from "../svg/Arrow_Left";
import Arrow_Right from "../svg/Arrow_Right";
import { getGameHistory } from "@/utils/action";

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

            <div className="space-y-2 overflow-y-auto sm:h-[62vh] pr-4 custom-scrollbar">
                {load ? (
                    <div className="fixed zindex top-0 left-0 w-full h-full">
                        <div className="w-full h-full relative  flex items-center justify-center">
                            <svg className="loader" viewBox="25 25 50 50">
                                <circle r="20" cy="50" cx="50"></circle>
                            </svg>
                        </div>
                    </div>
                ) : sessionData?.length > 0 ? (
                    sessionData?.map((item, ind) => (
                        <div key={ind} className="mt-6 bg-gray-700  rounded-xl">
                            <div
                                className={`bg-gray-700 p-6  ${item?.gameSessions?.length === 0
                                    ? "rounded-xl"
                                    : "rounded-tl-xl rounded-tr-xl"
                                    }  hover:shadow-xl transition-shadow duration-300`}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <InfoItem
                                        label="Platform Entry"
                                        value={new Date(item?.entryTime).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    />
                                    <InfoItem
                                        label="Platform Exit"
                                        value={new Date(item?.exitTime).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    />
                                    {item?.gameSessions?.length === 0 && (
                                        <InfoItem label="Game Played?" value={"No"} />
                                    )}
                                </div>
                            </div>
                            {item?.gameSessions?.map((subitem: any, index: number) => (
                                <div
                                    key={index}
                                    className=" p-6   shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <InfoItem label="Game Id" value={subitem?.gameId} />
                                        <InfoItem
                                            label="Credits at Entry"
                                            value={subitem?.creditsAtEntry}
                                        />
                                        <InfoItem label="Total Spins" value={subitem?.totalSpins} />
                                        <InfoItem
                                            label="Total Bet Amount"
                                            value={subitem?.totalBetAmount}
                                        />
                                        <InfoItem
                                            label="Total Win Amount"
                                            value={subitem?.totalWinAmount}
                                        />
                                        <InfoItem
                                            label="Game Session"
                                            value={subitem?.sessionDuration}
                                        />
                                        <InfoItem
                                            label="Entry Time"
                                            value={new Date(subitem?.entryTime).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        />
                                        <InfoItem
                                            label="Exit Time"
                                            value={new Date(subitem?.exitTime).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        />
                                    </div>
                                    {subitem?.spinData?.length > 0 && (
                                        <div className="mt-6">
                                            <h4 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ffd117] to-[#c65d02]">
                                                Spin Data:
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  overflow-y-auto pr-2 custom-scrollbar">
                                                {subitem?.spinData?.map((spin: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gray-600 p-3 rounded-lg text-xs sm:text-sm flex justify-between items-center"
                                                    >
                                                        <span className="font-medium text-gray-300">
                                                            Bet: {spin.betAmount}
                                                        </span>
                                                        <span className="font-medium text-green-400">
                                                            Win: {spin.winAmount}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
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

const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) => (
    <div className="bg-gray-600 px-4 py-3 rounded-lg shadow">
        <p className="text-xs sm:text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-100">
            {value}
        </p>
    </div>
);

export default PlayerGameHistory;
