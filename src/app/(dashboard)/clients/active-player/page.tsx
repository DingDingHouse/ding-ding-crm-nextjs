"use client";
import { useAppSelector } from "@/utils/hooks";
import { formatDate } from "@/utils/common";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useSocket } from "@/socket/SocketProvider";
import History from "@/components/svg/History";
import Delete from "@/components/svg/Delete";

export default function ActiveUsers() {
  const activeUsers = useAppSelector((state) => state.activeUsers.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showModal, setShowModal] = useState('');
  const { socket } = useSocket();
  const selectedUser = selectedUserId ? activeUsers[selectedUserId] : null;
  const [sessionData, setSessionData] = useState<any[]>([]);
  const filteredUsers = Object.entries(activeUsers).filter(([playerId]) =>
    playerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedUser?.currentGame?.entryTime) {
      const entryTime = new Date(selectedUser.currentGame.entryTime).getTime();
      const updateSessionDuration = () => {
        const currentTime = new Date().getTime();
        setSessionDuration(Math.floor((currentTime - entryTime) / 1000));
      };
      const intervalId = setInterval(updateSessionDuration, 1000);
      return () => clearInterval(intervalId);
    }
  }, [selectedUser]);

  const closeModal = () => {
    setSelectedUserId(null);
    setSessionDuration(0);
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
          setShowModal('')
        } else {
        }
      }
    );
  };

  // Fetch all player session data and display it in modal
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
          alert(`Error: ${response.message}`);
        }
      }
    );
  };

  const handelCloseSession = () => {
    setSessionData([]);
  }

  return (
    <div className="py-2 min-h-screen">
      <div className="bg-white dark:p-2 dark:bg-gray-800 rounded shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-200  dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
          <h2 className="text-2xl font-bold text-gray-600 dark:text-white">Active Players</h2>
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
            <ul className="space-y-4">
              {filteredUsers?.map(([playerId, playerData]) => (
                <li
                  key={playerId}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-sm"

                >
                  <div className="flex items-center justify-between">
                    <span className="tracking-wide capitalize text-lg font-semibold text-gray-600 dark:text-white">
                      {playerId}
                    </span>
                    <div className="space-x-4 flex items-center">
                      <button className="text-red-600 hover:scale-105 transition-all" onClick={() =>setShowModal(playerId)}><Delete /></button>
                      <button className="text-yellow-600 hover:scale-105 transition-all" onClick={() => getPlayerSession(playerId)}><History /></button>
                      <button onClick={() => setSelectedUserId(playerId)} className="bg-[#FFD117] px-4 py-1 text-sm hover:scale-105 transition-all rounded-full text-gray-700 font-semibold dark:text-white bg-opacity-35 border-[2px] border-[#F08D36]">View</button>
                      <span
                        className={`px-4 py-1 rounded-full text-sm ${playerData.currentGame?.gameId
                          ? "bg-green-500 bg-opacity-35 border-[2px] border-green-500 font-semibold text-green-600 dark:text-white"
                          : "bg-gray-600 text-gray-300"
                          }`}
                      >
                        {playerData.currentGame?.gameId || "No Active Game"}
                      </span>
                    </div>

                  </div>
                  <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">
                    Credits : <span className="text-green-500">{playerData.currentCredits}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 tracking-wide dark:text-gray-300">
                    Entry Time :{" "}
                    <span className="text-gray-400 dark:text-[#FFD117]"> {formatDate(playerData.entryTime?.toISOString() || null)}</span>
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
      {selectedUser && <Modal closeModal={closeModal}>
        <h3 className="text-xl font-bold capitalize text-center text-gray-600 dark:text-white mb-4">
          {selectedUser.playerId}'s Game Details
        </h3>
        {selectedUser.currentGame ? (
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-black dark:text-white">Game Id : </span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedUser?.currentGame?.gameId}</span>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-black dark:text-white">Credits at Entry : </span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedUser.currentGame.creditsAtEntry}</span>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-black dark:text-white">Total Spins : </span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedUser.currentGame.totalSpins}</span>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-black dark:text-white">Total Bet Amount : </span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedUser.currentGame.totalBetAmount}</span>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-black dark:text-white">Total Win Amount : </span>
                  <span className="text-gray-700 dark:text-gray-300">{selectedUser.currentGame.totalWinAmount}</span>
                </div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-900 px-4 py-2 rounded-md">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-black dark:text-white">Active From : </span>
                  <span className="text-gray-700 dark:text-gray-300">{sessionDuration} Sec</span>
                </div>
              </div>
            </div>
            <div className="mt-4  dark:text-gray-50">
              <div>Spin Data :</div>
              <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                {selectedUser?.currentGame?.spinData &&
                  selectedUser?.currentGame?.spinData?.map((spin: any, index: number) => (
                    <li key={index} className="bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 p-2 rounded-md">
                      Bet: {spin.betAmount}, Win: {spin.winAmount}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center">No active game details available.</p>
        )}
      </Modal>}
      {
        sessionData?.length > 0 &&
        <Modal closeModal={handelCloseSession}>
          <h3 className="text-xl font-bold capitalize text-center text-gray-600 dark:text-white mb-4">
            Player Game History
          </h3>
          <div className="space-y-5">
            {sessionData?.length > 0 ? sessionData?.map((item, ind) => (
              <div key={ind} className="space-y-5">
                {
                  item?.gameSessions?.map((subitem: any, index: number) => (

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

        </Modal>
      }
      {/* Exit User Modal */}
      {showModal && <Modal closeModal={()=>setShowModal('')}>
        <div>
          <p className="text-center dark:text-white">
            <span>Are you sure you want to Exit This Player ?</span>
          </p>
          <div className="flex justify-center gap-10 pt-5">
            <button
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-500 hover:bg-opacity-75  dark:text-white"
              onClick={() => setShowModal('')}
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
      </Modal>}
    </div>
  );
}