import { defineStore } from "pinia";
import type Player from "@/models/Player";

export const useGameStore = defineStore({
  id: "game",
  state: () => ({
    currentPlayer: {} as Player,
    playerA: {
      id: "A",
      name: "Player A",
      color: "var(--color-primary)",
      boxes: [],
    } as Player,
    playerB: {
      id: "B",
      name: "Player B",
      color: "var(--color-secondary)",
      boxes: [],
    } as Player,
  }),
  getters: {
    getCurrentPlayer: (state) => state.currentPlayer,
    getPlayerAScore: (state) => state.playerA.boxes.length,
    getPlayerBScore: (state) => state.playerB.boxes.length,
  },
  actions: {
    setCurrentPlayer(player: Player) {
      this.currentPlayer = player;
    },
    changePlayer() {
      if (this.currentPlayer.id === "A") {
        this.setCurrentPlayer(this.playerB);
      } else {
        this.setCurrentPlayer(this.playerA);
      }
    },
  },
});
