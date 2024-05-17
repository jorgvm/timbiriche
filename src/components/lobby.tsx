"use client";

import { updateGameInDatabase } from "@/utils/firebase";
import { getPlayerColor, getPlayerId } from "@/utils/player";
import { playSound } from "@/utils/sound";
import { useEffect } from "react";
import formStyles from "./form.module.scss";

const Lobby = ({ gameId, gameData }: { gameId: string; gameData: Game }) => {
  const isHost = gameData.players[0].id === getPlayerId();

  const startGame = async () => {
    // Pick a random player to be first
    const activePlayerId =
      gameData.players[Math.floor(Math.random() * gameData.players.length)].id;

    // Update gamedate in Firebase
    await updateGameInDatabase(gameId, {
      status: "playing",
      activePlayerId,
    });
  };

  const copyURL = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  useEffect(() => {
    const otherPlayers = gameData.players.filter((i) => i.id !== getPlayerId());

    if (otherPlayers.length > 0) {
      playSound("new-player");
    }
  }, [gameData]);

  return (
    <div className={formStyles.centered}>
      <div className={formStyles.box}>
        <h2>Players</h2>

        <ul className={formStyles.list}>
          {gameData.players.map((player, index) => {
            return (
              <li key={index}>
                <span
                  className={formStyles.playerColor}
                  style={{
                    color: getPlayerColor(gameData.players, player.id),
                  }}
                >
                  &#11044;
                </span>
                {` `}
                {player.name}
              </li>
            );
          })}
        </ul>

        {isHost ? (
          <button
            onClick={startGame}
            className={formStyles.button}
            // Allow singleplayer games during development
            // disabled={!enoughPlayers}
          >
            Start game!
          </button>
        ) : (
          <p className={formStyles.helpText}>
            Waiting for {gameData.players[0].name} to start the game...
          </p>
        )}
      </div>

      <div className={formStyles.box}>
        <p className={formStyles.helpText}>
          Invite your friends with this link:
        </p>

        <p className={formStyles.codeText}>{window.location.href}</p>

        <button
          className={formStyles.buttonSecondary}
          onClick={copyURL}
          type="button"
        >
          Copy url
        </button>
      </div>
    </div>
  );
};

export default Lobby;
