interface Player {
  id: string;
  name: string;
}

interface Room {
  id: string;
  owner?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  x: number;
  y: number;
}

type Side = "top" | "right" | "bottom" | "left";

type Gameboard = Room[];

interface Game {
  gameboard: Gameboard;
  players: Player[];
  gridWidth: number;
  gridHeight: number;
  status: "waiting-for-players" | "playing" | "finished";
  activePlayerId?: string;
  rematchId?: string;
}
