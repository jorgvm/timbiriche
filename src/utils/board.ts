import { Gameboard, Player, Room, Side } from "@/types";

/**
 * Generate a simple board filled with rooms
 *
 * @param maxRows Amount of rows
 * @param maxCols Amount of columns
 *
 * @returns new gameboard
 */
export const generateGameboard = (
  maxRows: number,
  maxCols: number
): Gameboard => {
  const newGameboard: Gameboard = [];

  for (let y = 0; y < maxCols; y++) {
    for (let x = 0; x < maxRows; x++) {
      newGameboard.push({
        id: `${x}${y}`,
        x,
        y,
        left: "",
        right: "",
        top: "",
        bottom: "",
      });
    }
  }

  return newGameboard;
};

/**
 * Update the gameboard
 *
 * @param gameboard The previous state of the board
 * @param room The selected room that has to be updated
 * @param side Which side was selected
 * @param player Which player created the action
 *
 * @returns updated gameboard
 */
export const updateGameboard = ({
  gameboard,
  room,
  side,
  player,
}: {
  gameboard: Gameboard;
  room: Room;
  side: Side;
  player: Player;
}): Gameboard =>
  gameboard.map((i) => {
    // Update wall
    if (i.id === room.id) {
      i[side] = player.id;
    }

    // Rooms share walls with adjacent rooms, so update the neighbouring room as well
    if (
      !i["right"] &&
      side === "left" &&
      i.y === room.y &&
      i.x === room.x - 1
    ) {
      // update neighbour: to the left
      i["right"] = player.id;
    } else if (
      !i["bottom"] &&
      side === "top" &&
      i.x === room.x &&
      i.y === room.y - 1
    ) {
      // update neighbour: above
      i["bottom"] = player.id;
    } else if (
      !i["left"] &&
      side === "right" &&
      i.y === room.y &&
      i.x === room.x + 1
    ) {
      // update neighbour: to the right
      i["left"] = player.id;
    } else if (
      !i["top"] &&
      side === "bottom" &&
      i.x === room.x &&
      i.y === room.y + 1
    ) {
      // update neighbour: below
      i["top"] = player.id;
    }

    return i;
  });

// Bot player
export const botPlayer = { id: "bot", name: "Timbi BoT" };
