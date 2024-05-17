import Cookies from "js-cookie";

export const COOKIES_ID = "timbiriche-player-id";
export const COOKIES_NAME = "timbiriche-player-name";

export const playerColors = [
  "#ffda6a", // yellow
  "#f06153", // red
  "#53d227", // green
  "#f121bd", // pink
  "#3e96ea", // blue
];

/**
 * Returns existing id set in cookies
 * If not set yet, generate new id and write to cookie
 *
 * @returns id from cookie or generator
 */
export const getPlayerId = () => {
  let playerId = Cookies.get(COOKIES_ID);

  if (!playerId) {
    playerId = crypto.randomUUID();
    Cookies.set(COOKIES_ID, playerId);
  }

  return playerId;
};

/**
 * Get the id of the next player
 * Base order on the array of players
 *
 * @param players  All players
 * @param currentId Id of current player
 * @returns id of next player
 */
export const getNextPlayer = (players: Player[], currentId?: string) => {
  if (!currentId) {
    return "";
  }

  const currentPlayerIndex = players.map((i) => i.id).indexOf(currentId);

  if (currentPlayerIndex + 1 === players.length) {
    // Last in array, so get first in array
    return players[0].id;
  } else {
    // Next in array
    return players[currentPlayerIndex + 1].id;
  }
};

/**
 * Get player color based on position in array
 *
 * @param players List of all players
 * @param playerId Which player id
 * @returns HEX color code
 */
export const getPlayerColor = (players: Player[], playerId: string) => {
  return playerColors[players.map((i) => i.id).indexOf(playerId)];
};
