<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useGameStore } from "@/stores/game";

const game = useGameStore();
const { currentPlayer, playerA, playerB } = storeToRefs(game);
</script>

<template>
  <div class="score">
    <span class="score-a">
      {{ game.getPlayerAScore }}
    </span>
    <span class="score-x">x</span>
    <span class="score-b">
      {{ game.getPlayerBScore }}
    </span>
  </div>
  <div>
    É a vez do
    <strong class="player-name">{{ currentPlayer.name }}</strong>
  </div>
</template>

<style scoped>
.player-name {
  padding: 0.2rem;
  font-weight: 800;
  border-bottom: 2px solid v-bind(currentPlayer.color);
  transition: 0.3s;
  will-change: border-bottom;
}

.score {
  font-size: 1.5rem;
  font-weight: 800;
  padding: 0.2rem;
}

.score-x {
  font-size: 1.2rem;
  font-weight: 400;
  padding: 0.2rem;
}

.score-a {
  color: v-bind(playerA.color);
}

.score-b {
  color: v-bind(playerB.color);
}
</style>
