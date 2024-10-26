"use client";

import { useAppSelector } from "@/utils/hooks";
import { formatDate } from "@/utils/common";
import { useState, useEffect } from "react";
import { useSocket } from "@/socket/SocketProvider";

export default function ActiveUsers() {
  const activeUsers = useAppSelector((state) => state.activeUsers.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const { socket } = useSocket();
  const [userStatuses, setUserStatuses] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [sessionData, setSessionData] = useState<any[]>([]);

  const selectedUser = selectedUserId ? activeUsers[selectedUserId] : null;

  const filteredUsers = Object.entries(activeUsers).filter(([playerId]) =>
    playerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Initialize userStatuses from Redux store on mount
  useEffect(() => {
    const initialStatuses: { [key: string]: boolean } = {};
    Object.entries(activeUsers).forEach(([playerId, playerData]) => {
      initialStatuses[playerId] = playerData.status === "active";
    });
    setUserStatuses(initialStatuses);
  }, [activeUsers]);

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
    setSessionData([]); // Close the session data modal as well
  };

  // Toggle player active/inactive status with server confirmation
  const toggleUserStatus = (username: string) => {
    const newStatus = !userStatuses[username];

    socket?.emit(
      "data",
      {
        action: "PLAYER_STATUS",
        payload: {
          playerId: username,
          status: newStatus ? "active" : "inactive",
        },
      },
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          setUserStatuses((prevStatuses) => ({
            ...prevStatuses,
            [username]: newStatus,
          }));
          console.log("Status updated successfully:", response.message);
        } else {
          console.error("Failed to update status:", response.message);
          alert(`Error: ${response.message}`);
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

  return (
    <div className="container mx-auto py-8 px-4 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-700 border-b border-gray-600">
          <h2 className="text-2xl font-bold text-white">Active Players</h2>
          <div className="mt-4 relative">
            <input
              type="search"
              placeholder="Search players..."
              className="w-full pl-10 pr-4 py-2 bg-gray-600 text-white placeholder-gray-400 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6">
          {filteredUsers.length > 0 ? (
            <ul className="space-y-4">
              {filteredUsers.map(([playerId, playerData]) => (
                <li
                  key={playerId}
                  className="bg-gray-700 rounded-lg p-4 shadow-sm cursor-pointer"
                  onClick={() => setSelectedUserId(playerId)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">
                      {playerId}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        playerData.currentGame?.gameId
                          ? "bg-green-800 text-green-200"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {playerData.currentGame?.gameId || "No Active Game"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Credits: {playerData.currentCredits}
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Entry Time:{" "}
                    {playerData.entryTime &&
                    !isNaN(new Date(playerData.entryTime).getTime())
                      ? formatDate(new Date(playerData.entryTime).toISOString())
                      : "N/A"}
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUserStatus(playerId);
                      }}
                      className={`px-4 py-2 rounded-md ${
                        userStatuses[playerId] ? "bg-red-600" : "bg-green-600"
                      } text-white font-semibold`}
                    >
                      {userStatuses[playerId] ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        getPlayerSession(playerId);
                      }}
                      className="ml-2 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold"
                    >
                      Get Session
                    </button>
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

      {/* Modal for Selected User's Game Details */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full relative overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedUser.playerId}'s Game Details
            </h3>
            {selectedUser.currentGame ? (
              <div>
                <p className="text-gray-400 mb-2">
                  <strong>Game ID:</strong> {selectedUser.currentGame.gameId}
                </p>
                <p className="text-gray-400 mb-2">
                  <strong>Credits at Entry:</strong>{" "}
                  {selectedUser.currentGame.creditsAtEntry}
                </p>
                <p className="text-gray-400 mb-2">
                  <strong>Total Spins:</strong>{" "}
                  {selectedUser.currentGame.totalSpins}
                </p>
                <p className="text-gray-400 mb-2">
                  <strong>Total Bet Amount:</strong>{" "}
                  {selectedUser.currentGame.totalBetAmount}
                </p>
                <p className="text-gray-400 mb-2">
                  <strong>Total Win Amount:</strong>{" "}
                  {selectedUser.currentGame.totalWinAmount}
                </p>
                <p className="text-gray-400 mb-2">
                  <strong>Session Duration:</strong> {sessionDuration} seconds
                </p>
              </div>
            ) : (
              <p className="text-gray-400">No active game details available.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal for All Player Sessions */}
      {sessionData.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full relative overflow-y-auto max-h-[80vh]">
            <button
              onClick={() => setSessionData([])}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-white mb-4">
              All Session Details for {sessionData[0]?.playerId}
            </h3>
            <div className="text-sm text-gray-300">
              {sessionData.map((session, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <p>
                    <strong>Manager:</strong> {session.managerName}
                  </p>
                  <p>
                    <strong>Initial Credits:</strong> {session.initialCredits}
                  </p>
                  <p>
                    <strong>Current Credits:</strong> {session.currentCredits}
                  </p>
                  <p>
                    <strong>Entry Time:</strong> {formatDate(session.entryTime)}
                  </p>
                  <p>
                    <strong>Exit Time:</strong> {formatDate(session.exitTime)}
                  </p>
                  <p>
                    <strong>Current RTP:</strong> {session.currentRTP}
                  </p>
                  <h4 className="mt-4 mb-2 text-lg font-bold">Game Sessions</h4>
                  {session.gameSessions.map((gameSession, i) => (
                    <div key={i} className="mb-4 p-4 bg-gray-600 rounded-lg">
                      <p>
                        <strong>Game ID:</strong> {gameSession.gameId}
                      </p>
                      <p>
                        <strong>Session ID:</strong> {gameSession.sessionId}
                      </p>
                      <p>
                        <strong>Entry Time:</strong>{" "}
                        {formatDate(gameSession.entryTime)}
                      </p>
                      <p>
                        <strong>Exit Time:</strong>{" "}
                        {formatDate(gameSession.exitTime)}
                      </p>
                      <p>
                        <strong>Credits at Entry:</strong>{" "}
                        {gameSession.creditsAtEntry}
                      </p>
                      <p>
                        <strong>Credits at Exit:</strong>{" "}
                        {gameSession.creditsAtExit}
                      </p>
                      <p>
                        <strong>Total Spins:</strong> {gameSession.totalSpins}
                      </p>
                      <p>
                        <strong>Total Bet Amount:</strong>{" "}
                        {gameSession.totalBetAmount}
                      </p>
                      <p>
                        <strong>Total Win Amount:</strong>{" "}
                        {gameSession.totalWinAmount}
                      </p>
                      <h5 className="mt-2 font-semibold">Spin Data:</h5>
                      <ul className="ml-4 list-disc">
                        {gameSession.spinData.map((spin, j) => (
                          <li key={j}>
                            Bet: {spin.betAmount}, Win: {spin.winAmount}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
