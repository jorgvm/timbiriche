// The name of the database collection in Firebase
export const DB_COLLECTION = "games";

/**
 * Generate a simple board filled with rooms
 * Each room has a top/right/bottom/left wall
 * An owner will be set once all walls are built
 *
 * @param maxRows Amount of rows
 * @param maxCols Amount of columns
 * @returns
 */
export const generateGameboard = (
  maxRows: number,
  maxCols: number
): Gameboard => {
  let newGameboard: Gameboard = [];

  for (let y = 0; y < maxRows; y++) {
    for (let x = 0; x < maxCols; x++) {
      newGameboard.push({
        id: `${x}${y}`,
        x,
        y,
      });
    }
  }

  return newGameboard;
};

/**
 * Update the board
 *
 * @param gameboard The previous state of the board
 * @param room The selected room that has to be updated
 * @param side Which side was selected
 * @param player Which player created the action
 */
export const updateBoard = ({
  gameboard,
  room,
  side,
  player,
}: {
  gameboard: Gameboard;
  room: Room;
  side: Side;
  player: Player;
}) =>
  gameboard.map((i) => {
    // Update wall
    if (!i[side] && i.id === room.id) {
      i[side] = player.id;
    }

    // Most rooms share a wall. Easy fix: update the neighbouring room as well
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

    // If all walls are built, set owner
    if (!i.owner && i.top && i.right && i.bottom && i.left) {
      i.owner = player.id;
    }

    return i;
  });
