"use client";
import styles from "./board.module.scss";

import { generateGameboard, updateGameboard } from "@/utils/board";
import { createGameInDatabase, updateGameInDatabase } from "@/utils/firebase";
import { findMostFrequent } from "@/utils/helpers";
import { getNextPlayer, getPlayerColor, getPlayerId } from "@/utils/player";
import { playSound } from "@/utils/sound";
import clsx from "clsx";
import Link from "next/link";
import { useEffect } from "react";
import formStyles from "./form.module.scss";
import Loading from "./loading";

const Gameboard = ({
  gameId,
  gameData,
}: {
  gameId: string;
  gameData: Game;
}) => {
  const localPlayer = gameData?.players.find((i) => i.id === getPlayerId());
  const amountOfWalls = gameData?.gameboard.reduce(
    (prev, cur) =>
      prev +
      Number(!!cur.top) +
      Number(!!cur.right) +
      Number(!!cur.bottom) +
      Number(!!cur.left),
    0
  );
  const amountOfRooms = gameData?.gameboard.reduce(
    (prev, cur) => prev + Number(!!cur.owner),
    0
  );

  // Which players gets to play next
  const activePlayer = gameData.players.find(
    (i) => i.id === gameData.activePlayerId
  );

  // Is it the local players turn
  const myTurn = localPlayer?.id && localPlayer.id === activePlayer?.id;

  // Are all rooms claimed?
  const gameIsFinished = !gameData.gameboard.find((i) => !i.owner);

  // Calculate which player owns the most rooms
  const roomOwnerIds = gameData.gameboard.map((i) => i.owner).filter(Boolean);
  const playersWithMostRooms: string[] =
    findMostFrequent(roomOwnerIds).filter(Boolean);

  const handleWallClick = async (side: Side, room: Room) => {
    // Prevent action if data is not available, if it's not the players turn, or the wall is already built
    if (!localPlayer || !myTurn || room[side]) {
      return;
    }

    // Keep track if user claimed a room (built all walls)
    let roomClaimed = false;

    // Update gameboard
    const updatedGameBoard = updateGameboard({
      gameboard: gameData.gameboard,
      room,
      side,
      player: localPlayer,
    });

    // If all walls are built, set owner
    updatedGameBoard.map((i) => {
      if (!i.owner && i.top && i.right && i.bottom && i.left) {
        i.owner = localPlayer.id;
        roomClaimed = true;
      }
    });

    // Check which player is next. If a room was claimed, the current user gets to play again
    const nextPlayer = roomClaimed
      ? localPlayer.id
      : getNextPlayer(gameData.players, gameData.activePlayerId);

    // If all rooms are taken, the game is finished
    const updatedGameFinished = !updatedGameBoard.find((i) => !i.owner);

    const data: Partial<Game> = {
      gameboard: updatedGameBoard,
      activePlayerId: updatedGameFinished ? "" : nextPlayer,
      status: updatedGameFinished ? "finished" : "playing",
    };

    // Update gamedate in Firebase
    await updateGameInDatabase(gameId, data);
  };

  useEffect(() => {
    console.log("start");
    playSound("start-game");
  }, []);

  // Wall built
  useEffect(() => {
    if (amountOfWalls > 0) {
      playSound("build-wall");
    }
  }, [amountOfWalls]);

  // Room built
  useEffect(() => {
    if (amountOfRooms > 0) {
      playSound("build-room");
    }
  }, [amountOfRooms]);

  // Game finished
  useEffect(() => {
    if (gameIsFinished) {
      if (playersWithMostRooms.includes(getPlayerId())) {
        playSound("won-game");
      } else {
        playSound("lost-game");
      }
    }
  }, [gameIsFinished, playersWithMostRooms, localPlayer]);

  console.log({ playersWithMostRooms, localPlayer });

  useEffect(() => {
    const createRematch = async () => {
      // Generate game data
      const rematchData: Game = {
        players: gameData.players,
        gameboard: generateGameboard(gameData.gridWidth, gameData.gridHeight),
        gridWidth: gameData.gridWidth,
        gridHeight: gameData.gridHeight,
        status: "waiting-for-players",
      };

      // Create new game in Firebase
      const rematchId = await createGameInDatabase(rematchData);

      // Set rematch id in finished game
      const data: Partial<Game> = {
        rematchId,
      };

      // Update gamedate in Firebase
      updateGameInDatabase(gameId, data);
    };

    const isHost = gameData.players[0].id === getPlayerId();

    // As the host, create a new game
    if (gameIsFinished && isHost && !gameData.rematchId) {
      createRematch();
    }
  }, [gameIsFinished, gameId, gameData]);

  if (!gameData) {
    return <Loading />;
  }

  return (
    <div className={styles.root}>
      <div
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${gameData?.gridWidth}, 1fr)`,
        }}
      >
        <div className={styles.shadow}></div>

        {gameData?.gameboard?.map((room, index) => (
          <div
            key={index}
            className={clsx(styles.room, room.owner && styles.roomOwned)}
            style={{
              color: room.owner
                ? getPlayerColor(gameData.players, room.owner)
                : undefined,
              // test all playercolours
              // color:
              //   playerColors[Math.floor(Math.random() * playerColors.length)],
              zIndex: -room.x,
            }}
          >
            <button
              className={clsx(
                styles.wall,
                styles.wallTop,
                room.top && styles.wallActive
              )}
              onClick={() => handleWallClick("top", room)}
            ></button>

            <button
              className={clsx(
                styles.wall,
                styles.wallRight,
                room.right && styles.wallActive
              )}
              onClick={() => handleWallClick("right", room)}
            ></button>

            <button
              className={clsx(
                styles.wall,
                styles.wallBottom,
                room.bottom && styles.wallActive
              )}
              onClick={() => handleWallClick("bottom", room)}
            ></button>

            <button
              className={clsx(
                styles.wall,
                styles.wallLeft,
                room.left && styles.wallActive
              )}
              onClick={() => handleWallClick("left", room)}
            ></button>
          </div>
        ))}
      </div>

      <div className={styles.status}>
        {/* My turn to play */}
        {myTurn && (
          <p>
            {" "}
            <span
              style={{
                color: getPlayerColor(gameData.players, localPlayer.id),
              }}
            >
              Your
            </span>{" "}
            turn!
          </p>
        )}

        {/* Not my turn */}
        {activePlayer?.id && !myTurn && (
          <p>
            waiting for {` `}
            <span
              style={{
                color: getPlayerColor(gameData.players, activePlayer.id),
              }}
            >
              {activePlayer?.name}
            </span>
            {` `}...
          </p>
        )}

        {/* One winner */}
        {gameIsFinished && playersWithMostRooms.length === 1 && (
          <p>
            <span
              style={{
                color: getPlayerColor(
                  gameData.players,
                  playersWithMostRooms[0]
                ),
              }}
            >
              {
                gameData.players.find((i) => i.id === playersWithMostRooms[0])
                  ?.name
              }
            </span>{" "}
            won the game!
          </p>
        )}

        {/* Multiple winners */}
        {gameIsFinished && playersWithMostRooms.length > 1 && (
          <p>
            Draw! {` `}
            {playersWithMostRooms.map((winner, index) => {
              return (
                <span key={index}>
                  {index !== 0 && " and "}
                  <span
                    style={{
                      color: getPlayerColor(gameData.players, winner),
                    }}
                  >
                    {gameData.players.find((i) => i.id === winner)?.name}
                  </span>
                </span>
              );
            })}
            {` `}won the game!
          </p>
        )}

        {/* Create new game */}
        {gameIsFinished && gameData.rematchId && (
          <Link
            className={clsx(formStyles.button, styles.rematch)}
            href={gameData.rematchId}
            onClick={() => playSound("button")}
          >
            Rematch!
          </Link>
        )}
      </div>
    </div>
  );
};

export default Gameboard;
