"use client";

import { getPlayerId } from "@/utils/player";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { DB_COLLECTION } from "@/utils/board";

const Lobby = ({ gameId, gameData }: { gameId: string; gameData: Game }) => {
  const isHost = gameData.players[0].id === getPlayerId();
  const enoughPlayers = gameData.players.length > 1;

  const startGame = async () => {
    // Pick a random player to be first
    const activePlayerId =
      gameData.players[Math.floor(Math.random() * gameData.players.length)].id;

    const data: Partial<Game> = {
      status: "playing",
      activePlayerId,
    };

    // Update gamedate in Firebase
    await updateDoc(doc(db, DB_COLLECTION, gameId), data);
  };

  return (
    <div>
      Players:
      <div>
        {gameData.players.map((player, index) => {
          return <div key={index}>{player.name}</div>;
        })}
      </div>
      {isHost ? (
        <button onClick={startGame} disabled={!enoughPlayers}>
          {enoughPlayers ? "Start game!" : "Waiting for another player"}
        </button>
      ) : (
        <div>Waiting for {gameData.players[0].name} to start the game!</div>
      )}
    </div>
  );
};

export default Lobby;
