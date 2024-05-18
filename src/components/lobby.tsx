import { updateGameInDatabase } from "@/utils/firebase";
import { getPlayerColor, getPlayerId } from "@/utils/player";
import { playSound } from "@/utils/sound";
import { useEffect } from "react";
import formStyles from "./form.module.scss";

/**
 * An overview of players
 * At least two players are needed to play the game
 * The host can start the game
 */
const Lobby = ({ gameId, gameData }: { gameId: string; gameData: Game }) => {
  const isHost = gameData.players[0].id === getPlayerId();
  const isAdmin = gameData.players[0].name === "admin";

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
    playSound("button");
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
        <p className={formStyles.helpText}>
          To play the game, invite your friends!
          <br />
          Send them this link:
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

        {/* We need at least one more player to start the game! */}
        {isHost && gameData.players.length < 2 && (
          <p className={formStyles.helpText}>Waiting for more players...</p>
        )}

        {/* Allow "admin" to play by itself for testing purposes */}
        {(isAdmin || (isHost && gameData.players.length > 1)) && (
          <button onClick={startGame} className={formStyles.button}>
            Start game!
          </button>
        )}

        {!isHost && (
          <p className={formStyles.helpText}>
            Waiting for {gameData.players[0].name} to start the game...
          </p>
        )}
      </div>
    </div>
  );
};

export default Lobby;
