"use client";

import { FormEvent, useState } from "react";
import { db } from "../utils/firebase";
import { DB_COLLECTION } from "../utils/board";
import { getPlayerId } from "@/utils/player";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const JoinGame = ({ gameId, gameData }: { gameId: string; gameData: Game }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Join game
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (name == "") {
      return;
    }

    setLoading(true);

    const newPlayer: Player = {
      id: getPlayerId(),
      name,
    };

    // Update gamedate in Firebase
    await updateDoc(doc(db, DB_COLLECTION, gameId), {
      players: arrayUnion(newPlayer) as unknown as Player[],
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          disabled={loading}
          maxLength={10}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Join game"}
        </button>
      </form>
    </div>
  );
};

export default JoinGame;
