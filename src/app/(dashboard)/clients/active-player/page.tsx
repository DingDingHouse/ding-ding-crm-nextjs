"use client";
import { useAppSelector } from "@/utils/hooks";
import { formatDate } from "@/utils/common";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useSocket } from "@/socket/SocketProvider";
import Delete from "@/components/svg/Delete";
import { StatsCard } from "@/components/modals/StatsCard";
import { TimeDisplay } from "@/components/modals/TimeDisplay";
import { SessionSpinChart } from "@/components/SessionSpinChart";
import SpinDataTable from "@/components/SpinDataTable";

export default function ActiveUsers() {
  const [viewType, setViewType] = useState('chart');

  const activeUsers = useAppSelector((state) => state.activeUsers.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState("");
  const { socket } = useSocket();
  const selectedUser = selectedUserId ? activeUsers[selectedUserId] : null;
  const filteredUsers = Object.entries(activeUsers).filter(([playerId]) =>
    playerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewChange = (type: string) => {
    setViewType(type)
  }


  const closeModal = () => {
    setSelectedUserId(null);
  };

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
          setShowModal("");
        } else {
        }
      }
    );
  };


  return (
    <div className="py-2 min-h-screen ">
      <div className="bg-white dark:p-2 dark:bg-gray-800 rounded shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-200  dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold text-gray-600 dark:text-white">
            Active Players
          </h2>
          <div className="mt-4 relative">
            <input
              type="search"
              placeholder="Search players..."
              className="w-full pl-10 pr-4 py-2 dark:bg-gray-600 text-gray-700 dark:text-white placeholder-gray-400 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD117] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="p-2 space-y-3">
          {filteredUsers?.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers?.map(([playerId, playerData]) => (
                <li
                  key={playerId}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-sm"
                >
                  <div className="lg:flex items-center justify-between">
                    <span className="tracking-wide capitalize text-lg font-semibold text-gray-600 dark:text-white">
                      {playerId}
                    </span>
                    <div className="space-x-4 flex items-center">
                      <button
                        className="text-red-600 hover:scale-105 transition-all"
                        onClick={() => setShowModal(playerId)}
                      >
                        <Delete />
                      </button>
                      <button
                        onClick={() => setSelectedUserId(playerId)}
                        className="bg-[#FFD117] px-4 py-1 text-sm hover:scale-105 transition-all rounded-full text-gray-700 font-semibold dark:text-white bg-opacity-35 border-[2px] border-[#F08D36]"
                      >
                        View
                      </button>
                      <span
                        className={`px-4 py-1 rounded-full text-sm ${playerData.currentGame?.gameId
                          ? "bg-green-500 bg-opacity-35 border-[2px] border-green-500 font-semibold text-green-600 dark:text-white"
                          : "bg-gray-600 text-gray-300"
                          }`}
                      >
                        {playerData.currentGame?.gameName ||
                          playerData.currentGame?.gameId ||
                          "No Game"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">
                    Current Credits :{" "}
                    <span className="text-green-500">
                      {playerData.currentCredits}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">
                    Credits at Entry :
                    <span className="text-gray-400 dark:text-[#FFD117]"> {playerData.initialCredits}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">
                    Entry Time :{" "}
                    <span className="text-gray-400 dark:text-[#FFD117]">
                      {" "}
                      {formatDate(playerData.entryTime?.toISOString() || null)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No active users found
            </div>
          )}
        </div>
      </div>

      {/* Modal for Game Details */}
      {selectedUser && (
        <Modal closeModal={closeModal} modaltype={{ Type: "activePlayer" }}>
          <div className=" h-full w-full">
            {selectedUser.currentGame && Object.keys(selectedUser.currentGame).length > 0 ? (
              <div className=" h-full bg-slate-700  p-4 rounded-lg flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard
                    label="Game ID"
                    value={selectedUser?.currentGame?.gameId || ""}
                  />
                  <StatsCard
                    label="Game Name"
                    value={selectedUser?.currentGame?.gameName || ""}
                  />
                  <StatsCard
                    label="Credits at Entry"
                    value={selectedUser?.currentGame?.creditsAtEntry.toFixed(3) || ""}
                  />
                  <StatsCard label="Current Credits" value={selectedUser.currentCredits.toFixed(3) || ""} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <TimeDisplay
                    label="Entry Time"
                    timestamp={
                      selectedUser?.currentGame?.entryTime + ""
                    }
                  />
                  <StatsCard
                    label="Total Bet Amount"
                    value={selectedUser?.currentGame?.totalBetAmount.toFixed(3) || 0}
                  />
                  <StatsCard
                    label="Total Win Amount"
                    value={selectedUser?.currentGame?.totalWinAmount.toFixed(3) || 0}
                  />
                  <StatsCard
                    label="Credits at Exit"
                    value={selectedUser?.currentGame?.creditsAtExit.toFixed(3) || ""}
                  />
                  <StatsCard
                    label="Total Spins"
                    value={selectedUser?.currentGame?.totalSpins || ""}
                  />
                </div>

                {selectedUser?.currentGame?.spinData &&
                  selectedUser?.currentGame?.spinData.length > 0 && (
                    <>
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
                            <SessionSpinChart spinData={selectedUser?.currentGame?.spinData || []} />
                          ) : (
                            <SpinDataTable spinData={selectedUser?.currentGame?.spinData || []} />
                          )}
                        </div>
                      </div>

                    </>


                  )}
              </div>
            ) : (
              <div className="text-center text-gray-400 h-full flex items-center justify-center">
                <h6 className=" text-white text-xl">
                  No active game details available.
                </h6>
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
              <span>Are you sure you want to Exit This Player ?</span>
            </p>
            <div className="flex justify-center gap-10 pt-5">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-500 hover:bg-opacity-75  dark:text-white"
                onClick={() => setShowModal("")}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md  bg-red-500 dark:bg-red-600 text-white hover:bg-opacity-75 dark:text-white"
                onClick={() => toggleUserStatus(showModal)}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
