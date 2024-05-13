"use client";

import Gameboard from "@/components/board";
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { DB_COLLECTION } from "@/utils/board";
import { db } from "@/utils/firebase";
import Lobby from "@/components/lobby";
import { getPlayerId } from "@/utils/player";
import JoinGame from "@/components/join-game";
import Link from "next/link";

type Props = {
  params: {
    gameid: string;
  };
};

export default function Game({ params }: Props) {
  const [gameData, setGameData] = useState<Game>();
  const [error, setError] = useState(false);

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
          setError(true);
          return;
        }
      });
    }

    getData();
  }, [gameId]);

  if (error) {
    return (
      <div>
        <p>This game doesn&lsquo;t exist</p>
        <Link href="/">Create new game!</Link>
      </div>
    );
  }

  if (!gameData) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h1>Timbiriche</h1>

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
