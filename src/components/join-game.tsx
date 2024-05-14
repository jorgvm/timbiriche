"use client";

import { FormEvent, useState } from "react";
import { db } from "../utils/firebase";
import { DB_COLLECTION } from "../utils/board";
import { getPlayerId } from "@/utils/player";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import formStyles from "./form.module.scss";

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
    <div className={formStyles.centered}>
      <form onSubmit={handleSubmit} className={formStyles.box}>
        <h2>Join game</h2>

        <div className={formStyles.formRow}>
          <span className={formStyles.label}>name:</span>

          <input
            type="text"
            value={name}
            className={formStyles.input}
            onChange={(e: any) => setName(e.target.value)}
            disabled={loading}
            maxLength={10}
            minLength={3}
          />
        </div>

        <button type="submit" disabled={loading} className={formStyles.button}>
          {loading ? "Loading..." : "Go!"}
        </button>
      </form>
    </div>
  );
};

export default JoinGame;
