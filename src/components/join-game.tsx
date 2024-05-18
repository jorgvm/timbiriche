import { updateGameInDatabase } from "@/utils/firebase";
import { getPlayerId } from "@/utils/player";
import { playSound } from "@/utils/sound";
import { arrayUnion } from "firebase/firestore";
import Link from "next/link";
import { FormEvent, useState } from "react";
import formStyles from "./form.module.scss";

/**
 * A form where users can join an existing game that has not started yet
 */
const JoinGame = ({ gameId, gameData }: { gameId: string; gameData: Game }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (name == "") {
      return;
    }

    setLoading(true);
    playSound("button");

    const newPlayer: Player = {
      id: getPlayerId(),
      name,
    };

    // Update gamedate in Firebase
    await updateGameInDatabase(gameId, {
      players: arrayUnion(newPlayer) as unknown as Player[],
    });
  };

  if (gameData.players.length > 1) {
    return (
      <div className={formStyles.centered}>
        <div className={formStyles.box}>
          <p className={formStyles.center}>This game is full!</p>

          <Link className={formStyles.button} href="/">
            Create new game!
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={formStyles.centered}>
      <form onSubmit={handleSubmit} className={formStyles.box}>
        <h2>Join game</h2>

        <div className={formStyles.formRow}>
          <span className={formStyles.label}>your name:</span>

          <input
            type="text"
            value={name}
            className={formStyles.input}
            onChange={(e: any) => setName(e.target.value)}
            disabled={loading}
            maxLength={10}
            minLength={3}
            required
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
