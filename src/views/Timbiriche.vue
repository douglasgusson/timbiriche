<script setup lang="ts">
import Board from "@/components/Board.vue";
import Scoreboard from "../components/Scoreboard.vue";
import CurrentPlayer from "../components/CurrentPlayer.vue";
</script>

<template>
  <div class="timbiriche">
    <Scoreboard />
    <CurrentPlayer />
    <Board :rows="6" :columns="6" />
  </div>
</template>

<style scoped>
.timbiriche {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}
</style>
