import Cookies from "js-cookie";

const COOKIES_ID = "timbiriche-player-id";

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
