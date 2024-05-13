"use client";

import styles from "./gameboard.module.css";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { DB_COLLECTION, updateBoard } from "../utils/board";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

let tempPlayerId = "abc"; // todo, fetch from cookie

const Gameboard = ({ gameId }: { gameId: string }) => {
  const [game, setGame] = useState<Game>();

  const player = game?.players.find((i) => i.id === tempPlayerId);

  // Fetch data from Firebsae
  useEffect(() => {
    async function getData() {
      onSnapshot(doc(db, DB_COLLECTION, gameId), (docSnap) => {
        if (docSnap.exists()) {
          setGame(docSnap.data() as Game);
        } else {
          // Game doesn't exist
          // todo: create missing game screen
          console.log("game doesn't exist!");
          return;
        }
      });
    }

    getData();
  }, [gameId]);

  const handleClick = async (side: Side, room: Room) => {
    if (!game || !player) {
      return;
    }

    const updatedBoard = updateBoard({
      gameboard: game.gameboard,
      room,
      side,
      player,
    });

    // Update gamedate in Firebase
    await updateDoc(doc(db, DB_COLLECTION, gameId), {
      gameboard: updatedBoard,
    });
  };

  if (!game || !player) {
    return <div>loading</div>;
  }

  return (
    <div
      className={styles.board}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${game?.gridWidth}, 1fr)`,
      }}
    >
      {game?.gameboard?.map((room, index) => {
        return (
          <div
            key={index}
            className={styles.room}
            style={{
              background: room.owner ? "red" : undefined,
              borderTopColor: room.top ? "black" : undefined,
              borderRightColor: room.right ? "black" : undefined,
              borderBottomColor: room.bottom ? "black" : undefined,
              borderLeftColor: room.left ? "black" : undefined,
            }}
          >
            <button
              className={clsx(styles.button, styles.buttonTop)}
              onClick={() => handleClick("top", room)}
            ></button>

            <button
              className={clsx(styles.button, styles.buttonRight)}
              onClick={() => handleClick("right", room)}
            ></button>

            <button
              className={clsx(styles.button, styles.buttonBottom)}
              onClick={() => handleClick("bottom", room)}
            ></button>

            <button
              className={clsx(styles.button, styles.buttonLeft)}
              onClick={() => handleClick("left", room)}
            ></button>
          </div>
        );
      })}
    </div>
  );
};

export default Gameboard;
