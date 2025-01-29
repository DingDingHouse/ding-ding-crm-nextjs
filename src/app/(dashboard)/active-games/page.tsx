"use client"
import { useAppSelector } from "@/utils/hooks"
import { formatDate } from "@/utils/common"
import { useState, useEffect } from "react"
import Modal from "@/components/Modal"
import { useSocket } from "@/socket/SocketProvider"
import Delete from "@/components/svg/Delete"
import { StatsCard } from "@/components/modals/StatsCard"
import { TimeDisplay } from "@/components/modals/TimeDisplay"
import { SessionSpinChart } from "@/components/SessionSpinChart"
import SpinDataTable from "@/components/SpinDataTable"
import { type PlayerData, CurrentGame } from "@/utils/Types"

export default function GameCategorizedUsers() {
    const [viewType, setViewType] = useState("chart")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [showModal, setShowModal] = useState("")

    const { socket } = useSocket()
    const activeUsers = useAppSelector((state) => state.activeUsers.users)

    const gameCategories = Object.values(activeUsers).reduce(
        (acc, user) => {
            if (user.currentGame) {
                const { gameId, gameName } = user.currentGame
                if (!acc[gameId]) {
                    acc[gameId] = { gameName, players: [] }
                }
                acc[gameId].players.push(user)
            }
            return acc
        },
        {} as Record<string, { gameName: string; players: PlayerData[] }>,
    )

    const filteredGames = Object.entries(gameCategories).filter(
        ([gameId, category]) => {
            if (!category || !category.gameName) return false;
            return (
                category.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                gameId.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
    );
    const selectedGame = selectedGameId ? gameCategories[selectedGameId] : null
    const selectedUser = selectedUserId ? activeUsers[selectedUserId] : null

    const handleViewChange = (type: string) => {
        setViewType(type)
    }

    const closeModal = () => {
        setSelectedUserId(null)
    }

    const toggleUserStatus = (username: string) => {
        socket?.emit(
            "data",
            {
                action: "PLAYER_STATUS",
                payload: {
                    playerId: username,
                    status: "inactive",
                },
            },
            (response: { success: boolean; message: string }) => {
                if (response.success) {
                    setShowModal("")
                } else {
                    console.error("Failed to update player status:", response.message)
                }
            },
        )
    }

    const renderGameCard = ([gameId, { gameName, players }]: [string, { gameName: string; players: PlayerData[] }]) => (
        <li
            key={gameId}
            className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-sm cursor-pointer"
            onClick={() => setSelectedGameId(gameId)}
        >
            <div className="flex items-center justify-between">
                <span className="tracking-wide capitalize text-lg font-semibold text-gray-600 dark:text-white">{gameName}</span>
                <span className="px-4 py-1 rounded-full text-sm bg-blue-500 bg-opacity-35 border-[2px] border-blue-500 font-semibold text-blue-600 dark:text-white flex items-center justify-center space-x-2 w-fit">
                    <span> {players.length}</span> <span className=" hidden md:block">Players</span>
                </span>
            </div>
            <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">Game ID: {gameId}</div>
        </li>
    )

    const renderPlayerCard = (player: PlayerData) => (
        <li key={player.playerId} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
            <div className="lg:flex items-center justify-between">
                <span className="tracking-wide capitalize text-lg font-semibold text-gray-600 dark:text-white">
                    {player.playerId}
                </span>
                <div className="space-x-4 flex items-center">
                    <button className="text-red-600 hover:scale-105 transition-all" onClick={() => setShowModal(player.playerId)}>
                        <Delete />
                    </button>
                    <button
                        onClick={() => setSelectedUserId(player.playerId)}
                        className="bg-[#FFD117] px-4 py-1 text-sm hover:scale-105 transition-all rounded-full text-gray-700 font-semibold dark:text-white bg-opacity-35 border-[2px] border-[#F08D36]"
                    >
                        View
                    </button>
                </div>
            </div>
            <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">
                Credits: <span className="text-green-500">{player.currentCredits}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">
                Credits at Entry :
                <span className="text-gray-400 dark:text-[#FFD117]"> {player.initialCredits}</span>
            </div>
            <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">
                Entry Time:{" "}
                <span className="text-gray-400 dark:text-[#FFD117]">{formatDate(player.entryTime?.toISOString() || null)}</span>
            </div>

        </li>
    )

    return (
        <div className="py-2 min-h-screen">
            <div className="bg-white dark:p-2 dark:bg-gray-800 rounded shadow-lg overflow-hidden">
                <div className="p-6 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                    <h2 className="text-2xl font-bold text-gray-600 dark:text-white">Games and Players</h2>
                    <div className="mt-4 relative">
                        <input
                            type="search"
                            placeholder="Search games..."
                            className="w-full pl-10 pr-4 py-2 dark:bg-gray-600 text-gray-700 dark:text-white placeholder-gray-400 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD117] focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className=" mt-4 space-y-3">
                    {selectedGameId ? (
                        <div>
                            <button
                                onClick={() => setSelectedGameId(null)}
                                className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md text-gray-700 dark:text-white"
                            >
                                ← Back to Games
                            </button>
                            <h3 className="text-xl font-semibold mb-4 text-gray-600 dark:text-white">
                                {selectedGame?.gameName} - Players
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{selectedGame?.players.map(renderPlayerCard)}</ul>
                        </div>
                    ) : filteredGames.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filteredGames.map(renderGameCard)}</ul>
                    ) : (
                        <div className="text-center py-8 text-gray-400">No games found</div>
                    )}
                </div>
            </div>

            {/* Modal for Player Details */}
            {selectedUser && (
                <Modal closeModal={closeModal} modaltype={{ Type: "activePlayer" }}>
                    <div className="h-full w-full">
                        {selectedUser.currentGame && Object.keys(selectedUser.currentGame).length > 0 ? (
                            <div className="h-full bg-slate-700 p-4 rounded-lg flex flex-col gap-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatsCard label="Game ID" value={selectedUser.currentGame.gameId || ""} />
                                    <StatsCard label="Game Name" value={selectedUser.currentGame.gameName || ""} />
                                    <StatsCard
                                        label="Credits at Entry"
                                        value={selectedUser.currentGame.creditsAtEntry.toFixed(3) || ""}
                                    />
                                    <StatsCard label="Current Credits" value={selectedUser.currentCredits.toFixed(3) || ""} />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    <TimeDisplay label="Entry Time" timestamp={selectedUser.currentGame.entryTime + ""} />
                                    <StatsCard
                                        label="Total Bet Amount"
                                        value={selectedUser.currentGame.totalBetAmount.toFixed(3) || "0"}
                                    />
                                    <StatsCard
                                        label="Total Win Amount"
                                        value={selectedUser.currentGame.totalWinAmount.toFixed(3) || "0"}
                                    />
                                    <StatsCard label="Credits at Exit" value={selectedUser.currentGame.creditsAtExit.toFixed(3) || ""} />
                                    <StatsCard label="Total Spins" value={selectedUser.currentGame.totalSpins || ""} />

                                </div>

                                {selectedUser.currentGame.spinData && selectedUser.currentGame.spinData.length > 0 && (
                                    <div className="mt-4">
                                        <div className="flex border-b border-gray-600">
                                            <button
                                                className={`py-2 px-4 ${viewType === "chart"
                                                    ? "border-b-2 border-blue-500 text-blue-500"
                                                    : "text-gray-400 hover:text-white"
                                                    }`}
                                                onClick={() => handleViewChange("chart")}
                                            >
                                                Chart View
                                            </button>
                                            <button
                                                className={`py-2 px-4 ${viewType === "raw"
                                                    ? "border-b-2 border-blue-500 text-blue-500"
                                                    : "text-gray-400 hover:text-white"
                                                    }`}
                                                onClick={() => handleViewChange("raw")}
                                            >
                                                Raw Data
                                            </button>
                                        </div>
                                        <div className="mt-4">
                                            {viewType === "chart" ? (
                                                <SessionSpinChart spinData={selectedUser.currentGame.spinData || []} />
                                            ) : (
                                                <SpinDataTable spinData={selectedUser.currentGame.spinData || []} />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 h-full flex items-center justify-center">
                                <h6 className="text-white text-xl">No active game details available.</h6>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Exit User Modal */}
            {showModal && (
                <Modal closeModal={() => setShowModal("")}>
                    <div>
                        <p className="text-center dark:text-white">
                            <span>Are you sure you want to Exit This Player?</span>
                        </p>
                        <div className="flex justify-center gap-10 pt-5">
                            <button
                                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-500 hover:bg-opacity-75 dark:text-white"
                                onClick={() => setShowModal("")}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-md bg-red-500 dark:bg-red-600 text-white hover:bg-opacity-75 dark:text-white"
                                onClick={() => toggleUserStatus(showModal)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

