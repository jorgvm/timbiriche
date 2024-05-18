"use client";

import formStyles from "@/components/form.module.scss";
import Gameboard from "@/components/gameboard";
import JoinGame from "@/components/join-game";
import Loading from "@/components/loading";
import Lobby from "@/components/lobby";
import Rules from "@/components/rules";
import { DB_COLLECTION, db } from "@/utils/firebase";
import { getPlayerId } from "@/utils/player";
import clsx from "clsx";
import { doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

type PageProps = {
  params: {
    gameid: string;
  };
};

const Page = ({ params }: PageProps) => {
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
          <div>
            <p className={clsx(formStyles.helpText, formStyles.center)}>
              Oops, wrong link? <br />
              This game doesn&lsquo;t exist...
            </p>

            <Link className={formStyles.button} href="/">
              Create new game!
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!gameData) {
    return <Loading />;
  }

  return (
    <>
      <Rules />

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
};

export default Page;
