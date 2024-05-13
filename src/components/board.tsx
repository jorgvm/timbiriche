"use client";

import styles from "./board.module.css";

import clsx from "clsx";
import { DB_COLLECTION, updateGameboard } from "../utils/board";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { getNextPlayer, getPlayerId, playerColors } from "@/utils/player";
import { findMostFrequent } from "@/utils/helpers";

const Gameboard = ({
  gameId,
  gameData,
}: {
  gameId: string;
  gameData: Game;
}) => {
  // Local player
  const player = gameData?.players.find((i) => i.id === getPlayerId());

  // Which players gets to play next
  const activePlayer = gameData.players.find(
    (i) => i.id === gameData.activePlayerId
  );

  // Is it the local players turn
  const myTurn = activePlayer?.id === player?.id;

  // Are all rooms claimed?
  const gameIsFinished = !gameData.gameboard.find((i) => !i.owner);

  // Calculate which player owns the most rooms
  const roomOwnerIds = gameData.gameboard.map((i) => i.owner).filter(Boolean);
  const playersWithMostRooms = findMostFrequent(roomOwnerIds);

  const handleWallClick = async (side: Side, room: Room) => {
    // Prevent action if data is not available, if it's not the players turn, or the wall is already built
    if (!player || !myTurn || room[side]) {
      return;
    }

    // Keep track if user claimed a room (built all walls)
    let roomClaimed = false;

    // Update gameboard
    const updatedGameBoard = updateGameboard({
      gameboard: gameData.gameboard,
      room,
      side,
      player,
    });

    // If all walls are built, set owner
    updatedGameBoard.map((i) => {
      if (!i.owner && i.top && i.right && i.bottom && i.left) {
        i.owner = player.id;
        roomClaimed = true;
      }
    });

    // Check who is the next player. If a room was claimed, the current user gets to play again
    const nextPlayer = roomClaimed
      ? player.id
      : getNextPlayer(gameData.players, gameData.activePlayerId);

    // If all rooms are taken, the game is finished
    const updatedGameFinished = !updatedGameBoard.find((i) => !i.owner);

    const data: Partial<Game> = {
      gameboard: updatedGameBoard,
      activePlayerId: updatedGameFinished ? "" : nextPlayer,
      status: updatedGameFinished ? "finished" : "playing",
    };

    // Update gamedate in Firebase
    await updateDoc(doc(db, DB_COLLECTION, gameId), data);
  };

  if (!gameData) {
    return <div>loading</div>;
  }

  return (
    <div>
      <div
        className={styles.board}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gameData?.gridWidth}, 1fr)`,
        }}
      >
        {gameData?.gameboard?.map((room, index) => (
          <div
            key={index}
            className={clsx(styles.room, room.owner && styles.roomOwned)}
            style={{
              color: room.owner
                ? playerColors[
                    gameData.players.map((i) => i.id).indexOf(room.owner)
                  ]
                : undefined,
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

      <div style={{ background: "black", color: "white" }}>
        {myTurn && "Your turn!"}

        {activePlayer?.id && !myTurn && `Waiting for ${activePlayer?.name}`}

        {gameIsFinished &&
          playersWithMostRooms.length === 1 &&
          `${
            gameData.players.find((i) => playersWithMostRooms)?.name
          } won the game!`}

        {gameIsFinished &&
          playersWithMostRooms.length > 1 &&
          `The game is a draw between ${playersWithMostRooms
            .map((i) => gameData.players.find((x) => x.id === i)?.name)
            .join(" and ")}!`}
      </div>
    </div>
  );
};

export default Gameboard;
