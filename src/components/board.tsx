"use client";

import styles from "./board.module.css";

import clsx from "clsx";
import { DB_COLLECTION, updateGameboard } from "../utils/board";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { getNextPlayer, getPlayerId } from "@/utils/player";
import { findMostFrequent } from "@/utils/helpers";

const playerColours = ["red", "blue", "yellow", "green", "brown"];

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

  if (!gameData || !player) {
    return <div>loading</div>;
  }

  console.log(
    gameData,
    playersWithMostRooms,
    playersWithMostRooms.map((i) => gameData.players.find((p) => p.id === i))
  );

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
            className={styles.room}
            style={{
              background: room.owner
                ? playerColours[
                    gameData.players.map((i) => i.id).indexOf(room.owner)
                  ]
                : undefined,
              borderTopColor: room.top
                ? playerColours[
                    gameData.players.map((i) => i.id).indexOf(room.top)
                  ]
                : undefined,
              borderRightColor: room.right
                ? playerColours[
                    gameData.players.map((i) => i.id).indexOf(room.right)
                  ]
                : undefined,
              borderBottomColor: room.bottom
                ? playerColours[
                    gameData.players.map((i) => i.id).indexOf(room.bottom)
                  ]
                : undefined,
              borderLeftColor: room.left
                ? playerColours[
                    gameData.players.map((i) => i.id).indexOf(room.left)
                  ]
                : undefined,
            }}
          >
            <button
              className={clsx(styles.button, styles.buttonTop)}
              onClick={() => handleWallClick("top", room)}
            ></button>

            <button
              className={clsx(styles.button, styles.buttonRight)}
              onClick={() => handleWallClick("right", room)}
            ></button>

            <button
              className={clsx(styles.button, styles.buttonBottom)}
              onClick={() => handleWallClick("bottom", room)}
            ></button>

            <button
              className={clsx(styles.button, styles.buttonLeft)}
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
