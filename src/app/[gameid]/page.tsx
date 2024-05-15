"use client";

import Gameboard from "@/components/board";
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";

import { DB_COLLECTION, db } from "@/utils/firebase";
import Lobby from "@/components/lobby";
import { getPlayerId } from "@/utils/player";
import JoinGame from "@/components/join-game";
import Link from "next/link";
import Loading from "@/components/loading";
import formStyles from "@/components/form.module.scss";
import clsx from "clsx";

type PageProps = {
  params: {
    gameid: string;
  };
};

export default function Game({ params }: PageProps) {
  const [gameData, setGameData] = useState<Game>();
  const [error, setError] = useState(false);

  const gameId = params.gameid;

  // Check if local player has already joined the game
  const hasJoined = gameData?.players.find((i) => i.id === getPlayerId());

  // Fetch data from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, DB_COLLECTION, gameId),
      (docSnap) => {
        if (docSnap.exists()) {
          setGameData(docSnap.data() as Game);
        } else {
          // Game doesn't exist
          setError(true);
          return;
        }
      }
    );

    return () => unsubscribe();
  }, [gameId]);

  if (error) {
    return (
      <div className={formStyles.centered}>
        <div className={formStyles.box}>
          <p className={clsx(formStyles.helpText, formStyles.center)}>
            Oops, wrong link? <br />
            This game doesn&lsquo;t exist...
          </p>

          <Link className={formStyles.button} href="/">
            Create new game!
          </Link>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return <Loading />;
  }

  return (
    <>
      {gameData.status === "waiting-for-players" && hasJoined && (
        <Lobby gameId={gameId} gameData={gameData} />
      )}

      {gameData.status === "waiting-for-players" && !hasJoined && (
        <JoinGame gameId={gameId} gameData={gameData} />
      )}

      {(gameData.status === "playing" || gameData.status === "finished") && (
        <Gameboard gameId={gameId} gameData={gameData} />
      )}
    </>
  );
}
