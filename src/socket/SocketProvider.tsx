"use client";

import {
  addPlayer,
  enterGame,
  exitGame,
  removePlayer,
  updateSpin,
} from "@/redux/features/activeUsersSlice";
import { setUsercredit } from "@/redux/user/userSlice";
import { CurrentGame, EventType } from "@/utils/Types";
import { config } from "@/utils/config";
import { useAppDispatch } from "@/utils/hooks";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{
  token: string;
  children: React.ReactNode;
}> = ({ token, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      const socketInstance = io(`${config?.server}`, {
        auth: { token },
      });
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("Connected with socket id:", socketInstance?.id);
      });

      socketInstance.on("activePlayers", (activePlayersData) => {
        activePlayersData.forEach((player:any) => {
          dispatch(
            addPlayer({
              playerId: player.playerId,
              status: player?.status,
              managerName: player.managerName,
              initialCredits: player.initialCredits,
              currentCredits: player.currentCredits,
              entryTime: new Date(player.entryTime),
              exitTime: player.exitTime ? new Date(player.exitTime) : null,
              currentRTP: player.currentRTP,
              currentGame: player.currentGame || {},
            })
          );
        });
      });

      socketInstance.on("PLATFORM", (data: any) => {
        handlePlatformEvent(data);
      });

      socketInstance.on("data", (data: any) => {
        switch (data.type) {
          case "CREDITS":
            hadleCurrentUserCredits(data?.payload);
            break;

          default:
            console.warn(`Unhandled event type: ${data.type}`);
        }
      });

      socketInstance.on("error", (error) => {
        toast.remove();
        toast.error(`Error from server: ${error.message}`);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token]);
  const handlePlatformEvent = (data: any) => {
    switch (data.type) {
      case EventType.ENTERED_PLATFORM:
        handleEnteredPlatform(data.payload);
        break;

      case EventType.EXITED_PLATFORM:
        handleExitedPlatform(data.payload);
        break;

      case EventType.ENTERED_GAME:
        handleEnteredGame(data.payload);
        break;

      case EventType.UPDATED_SPIN:
        handleUpdatedSpin(data.payload);
        break;

      case EventType.EXITED_GAME:
        handleExitedGame(data.payload);
        break;

      default:
        console.warn(`Unhandled event type: ${data.type}`);
    }
  };

  const handleEnteredPlatform = (payload: any) => {
    const {
      playerId,
      managerName,
      initialCredits,
      currentCredits,
      entryTime,
      exitTime,
      currentRTP,
      currentGame,
    } = payload;

    dispatch(
      addPlayer({
        playerId,
        status,
        managerName,
        initialCredits,
        currentCredits,
        entryTime: new Date(entryTime),
        exitTime: exitTime ? new Date(exitTime) : null,
        currentRTP,
        currentGame,
      })
    );
  };

  const handleExitedPlatform = (payload: any) => {
    const { playerId } = payload;
    dispatch(removePlayer({ playerId }));
  };

  const handleEnteredGame = (payload: any) => {
    const {
      playerId,
      gameId,
      sessionId,
      entryTime,
      exitTime,
      creditsAtEntry,
      creditsAtExit,
      totalSpins,
      totalBetAmount,
      totalWinAmount,
      spinData,
      sessionDuration,
    } = payload;

    dispatch(
      enterGame({
        playerId,
        gameId,
        sessionId,
        entryTime: new Date(entryTime), // Pass Date object directly
        exitTime: exitTime ? new Date(exitTime) : null, // Keep as Date or null
        creditsAtEntry,
        creditsAtExit,
        totalSpins,
        totalBetAmount,
        totalWinAmount,
        spinData,
        sessionDuration,
      })
    );

  };

  

  const handleExitedGame = (payload: any) => {
    const { playerId } = payload;
    dispatch(exitGame({ playerId }));
  };

  const handleUpdatedSpin = (summary: CurrentGame) => {
    dispatch(updateSpin(summary)); // Use the full payload to ensure all fields are updated
  };


  const hadleCurrentUserCredits = (payload: any) => {
    const { credits, role } = payload;
    if (role === "company") {
      dispatch(setUsercredit('Infinite'));
    } else {
      dispatch(setUsercredit(credits));
    }
  };

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};