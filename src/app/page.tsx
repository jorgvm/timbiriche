"use client";

import styles from "./page.module.css";
import boardStyles from "./board.module.css";
import { useState } from "react";
import clsx from "clsx";

interface Game {
  id: string;
  board: Square[];
}

interface Square {
  owner?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  x: number;
  y: number;
}
[];

const playerId = "abc";

const generateBoard = (maxRows: number, maxCols: number): Square[] => {
  let newBoard: Square[] = [];

  for (let y = 0; y < maxRows; y++) {
    for (let x = 0; x < maxCols; x++) {
      newBoard.push({
        owner: undefined,
        top: undefined,
        right: undefined,
        bottom: undefined,
        left: undefined,
        x,
        y,
      });
    }
  }

  return newBoard;
};

const GameBoard = ({
  board,
  placeWall,
}: {
  board: Square[];
  placeWall: Function;
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}
    >
      {board?.map((square, index) => {
        return (
          <div
            key={index}
            className={boardStyles.square}
            style={{
              background: square.owner && "red",
              borderTopColor: square.top && "black",
              borderRightColor: square.right && "black",
              borderBottomColor: square.bottom && "black",
              borderLeftColor: square.left && "black",
            }}
          >
            <button
              className={clsx(boardStyles.button, boardStyles.buttonTop)}
              onClick={() => placeWall({ square, side: "top" })}
            ></button>

            <button
              className={clsx(boardStyles.button, boardStyles.buttonRight)}
              onClick={() => placeWall({ square, side: "right" })}
            ></button>

            <button
              className={clsx(boardStyles.button, boardStyles.buttonBottom)}
              onClick={() => placeWall({ square, side: "bottom" })}
            ></button>

            <button
              className={clsx(boardStyles.button, boardStyles.buttonLeft)}
              onClick={() => placeWall({ square, side: "left" })}
            ></button>
          </div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const [board, setBoard] = useState(generateBoard(4, 4));

  const updateBoard = ({
    square,
    side,
  }: {
    square: Square;
    side: "top" | "right" | "bottom" | "left";
  }) => {
    console.log("place", square, side);

    const updatedBoard = board.map((i) => {
      if (!i[side] && i.x === square.x && i.y === square.y) {
        // Update wall
        i[side] = playerId;
      }

      // Rooms share a wall. Easy fix: update the neighbouring room as well
      if (
        !i["right"] &&
        side === "left" &&
        i.y === square.y &&
        i.x === square.x - 1
      ) {
        i["right"] = playerId;
      }

      if (
        !i["bottom"] &&
        side === "top" &&
        i.x === square.x &&
        i.y === square.y - 1
      ) {
        i["bottom"] = playerId;
      }

      if (
        !i["left"] &&
        side === "right" &&
        i.y === square.y &&
        i.x === square.x + 1
      ) {
        i["left"] = playerId;
      }

      if (
        !i["top"] &&
        side === "bottom" &&
        i.x === square.x &&
        i.y === square.y + 1
      ) {
        i["top"] = playerId;
      }

      // If all walls are set, set owner
      if (!i.owner && i.top && i.right && i.bottom && i.left) {
        i.owner = playerId;
      }
      return i;
    });

    // Update board
    setBoard(updatedBoard);
  };

  console.log({
    board,
  });

  return (
    <main className={styles.main}>
      <GameBoard board={board} placeWall={updateBoard} />
    </main>
  );
}
