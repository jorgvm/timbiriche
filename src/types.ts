export interface Player {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  owner?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  x: number;
  y: number;
}

export type Side = "top" | "right" | "bottom" | "left";

export type Gameboard = Room[];

export interface Game {
  gameboard: Gameboard;
  players: Player[];
  gridWidth: number;
  gridHeight: number;
  status: "waiting-for-players" | "playing" | "finished";
  activePlayerId?: string;
  rematchId?: string;
}
