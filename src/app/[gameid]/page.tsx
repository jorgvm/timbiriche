"use client";

import Gameboard from "@/components/board";
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { DB_COLLECTION } from "@/utils/board";
import { db } from "@/utils/firebase";
import Lobby from "@/components/lobby";
import { getPlayerId } from "@/utils/player";
import JoinGame from "@/components/join-game";

type Props = {
  params: {
    gameid: string;
  };
};

export default function Game({ params }: Props) {
  const [gameData, setGameData] = useState<Game>();

  const gameId = params.gameid;

  // Check if local player has already joined the game
  const hasJoined = gameData?.players.find((i) => i.id === getPlayerId());

  // Fetch data from Firebsae
  useEffect(() => {
    async function getData() {
      // Using onSnapShot will keep fetching the latest data
      onSnapshot(doc(db, DB_COLLECTION, gameId), (docSnap) => {
        if (docSnap.exists()) {
          setGameData(docSnap.data() as Game);
        } else {
          // Game doesn't exist
          console.log("game doesn't exist!");
          return;
        }
      });
    }

    getData();
  }, [gameId]);

  if (!gameData) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {gameData.status === "waiting-for-players" && hasJoined && (
        <Lobby gameId={gameId} gameData={gameData} />
      )}

      {gameData.status === "waiting-for-players" && !hasJoined && (
        <JoinGame gameId={gameId} gameData={gameData} />
      )}

      {(gameData.status === "playing" || gameData.status === "finished") && (
        <Gameboard gameId={gameId} gameData={gameData} />
      )}
    </div>
  );
}
