"use client";

import { FormEvent, useState } from "react";
import { createGameInDatabase } from "../utils/firebase";
import { useRouter } from "next/navigation";
import { generateGameboard } from "../utils/board";
import { getPlayerId } from "@/utils/player";

import formStyles from "./form.module.scss";

const CreateGame = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [gridSize, setGridSize] = useState("2x2");

  // Create a new game
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prevent empty name
    if (name == "") {
      return;
    }

    setLoading(true);

    // Get grid dimension numbers from string
    const [gridWidth, gridHeight] = gridSize.split("x").map((i) => Number(i));

    // Generate game data
    const gameData: Game = {
      players: [
        {
          id: getPlayerId(),
          name,
        },
      ],
      gameboard: generateGameboard(gridWidth, gridHeight),
      gridWidth,
      gridHeight,
      status: "waiting-for-players",
    };

    // Create new game in Firebase
    await createGameInDatabase(gameData)
      .then((newGameId) => {
        // Navigate to id generated by Firebase
        router.push("/" + newGameId);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <div className={formStyles.centered}>
      <form onSubmit={handleSubmit} className={formStyles.box}>
        <h2>New game</h2>

        <div className={formStyles.formRow}>
          <span className={formStyles.label}>grid size:</span>

          <select
            className={formStyles.input}
            value={gridSize}
            onChange={(e) => setGridSize(e.target.value)}
            disabled={loading}
          >
            <option value="2x2">Small</option>
            <option value="4x4">Medium</option>
            <option value="5x5">Large</option>
            <option value="5x7">XXL</option>
          </select>
        </div>

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
            required
          />
        </div>

        <button type="submit" disabled={loading} className={formStyles.button}>
          {loading ? "Loading..." : "Create game"}
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
