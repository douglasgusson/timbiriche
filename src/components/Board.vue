<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import type Point from "@/models/Point";
import LineComponent from "./LineComponent.vue";
import type Box from "@/models/Box";
import type Line from "@/models/Line";
import { useGameStore } from "@/stores/game";

const props = defineProps<{
  rows: number;
  columns: number;
}>();

const scale = ref(50);
const points = ref<Point[]>([]);
const lines = ref<Line[]>([]);
const boxes = ref<Box[]>([]);
const boxesMarked = ref<Box[]>([]);
const linesMarked = ref<Line[]>([]);

const gameStore = useGameStore();
const { playerA, playerB, currentPlayer } = storeToRefs(gameStore);

const cartesianProduct = (a: number[], b: number[]): Point[] =>
  a.reduce((acc, x) => b.reduce((acc, y) => [...acc, { x, y }], acc), []);

const compareLines = (l1: Line, l2: Line) =>
  l1.a.x === l2.a.x &&
  l1.a.y === l2.a.y &&
  l1.b.x === l2.b.x &&
  l1.b.y === l2.b.y;

const populateLines = (boxes: Box[]) => {
  boxes.forEach((box) => {
    box.lines.forEach((line) => {
      const existingLine = lines.value.find((l) => compareLines(l, line));
      if (!existingLine) {
        lines.value.push(line);
      }
    });
  });
};

const createBoard = () => {
  points.value = cartesianProduct(
    Array.from({ length: props.rows }, (_, i) => i),
    Array.from({ length: props.columns }, (_, i) => i)
  );

  points.value.forEach((point) => {
    if (point.y < props.columns - 1 && point.x < props.rows - 1) {
      const { x, y } = point;
      const box: Box = {
        initialPoint: point,
        lines: [
          { a: { x, y }, b: { x, y: y + 1 } },
          { a: { x, y }, b: { x: x + 1, y: y } },
          { a: { x, y: y + 1 }, b: { x: x + 1, y: y + 1 } },
          { a: { x: x + 1, y }, b: { x: x + 1, y: y + 1 } },
        ],
      };
      boxes.value.push(box);
    }
  });
};

const findBoxesWithLine = (line: Line): Box[] =>
  boxes.value.filter((box) => box.lines.some((l) => compareLines(l, line)));

const findCompletedBoxes = (boxesToFind: Box[]): Box[] =>
  boxesToFind.filter((box) =>
    box.lines.every((line) =>
      linesMarked.value.some((l) => compareLines(l, line))
    )
  );

const onLineMarked = (lineMarked: Line) => {
  linesMarked.value.push(lineMarked);
  const boxesWithLine = findBoxesWithLine(lineMarked);
  const boxesCompleted = findCompletedBoxes(boxesWithLine);

  if (boxesCompleted.length > 0) {
    boxesMarked.value.push(...boxesCompleted);
    console.log(lineMarked, boxesCompleted);
    currentPlayer.value.boxes.push(...boxesCompleted);
    return;
  }
  gameStore.changePlayer();
};

const svgProps = computed(() => ({
  height: props.rows * scale.value,
  width: props.columns * scale.value,
  viewBox: `${-scale.value / 2} ${-scale.value / 2} ${
    props.columns * scale.value
  } ${props.rows * scale.value}`,
}));

onMounted(() => {
  createBoard();
  populateLines(boxes.value);
  gameStore.setCurrentPlayer(playerA.value);
});
</script>

<template>
  <svg
    class="board"
    :height="svgProps.height"
    :width="svgProps.width"
    :viewBox="svgProps.viewBox"
  >
    <g id="lines">
      <LineComponent
        v-for="(line, i) in lines"
        :key="`line_${i}`"
        :a="line.a"
        :b="line.b"
        @marked="onLineMarked"
        :scale="scale"
      />
    </g>
    <g id="points">
      <circle
        v-for="(point, i) in points"
        :key="`point_${i}`"
        :cx="point.x * scale"
        :cy="point.y * scale"
        :r="scale * 0.15"
        fill="var(--color-tertiary)"
      />
    </g>
    <g id="merkers">
      <template
        v-for="(boxMarked, i) in playerA.boxes"
        :key="`box_marked_player_a_${i}`"
      >
        <circle
          :cx="boxMarked.initialPoint.x * scale + scale / 2"
          :cy="boxMarked.initialPoint.y * scale + scale / 2"
          :r="scale / 3"
          :fill="playerA.color"
        />
        <text
          :x="boxMarked.initialPoint.x * scale + scale / 2"
          :y="boxMarked.initialPoint.y * scale + scale / 2"
          fill="white"
        >
          A
        </text>
      </template>
      <template
        v-for="(boxMarked, i) in playerB.boxes"
        :key="`box_marked_player_b_${i}`"
      >
        <circle
          :cx="boxMarked.initialPoint.x * scale + scale / 2"
          :cy="boxMarked.initialPoint.y * scale + scale / 2"
          :r="scale / 3"
          :fill="playerB.color"
        />
        <text
          :x="boxMarked.initialPoint.x * scale + scale / 2"
          :y="boxMarked.initialPoint.y * scale + scale / 2"
          fill="white"
        >
          B
        </text>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
}
</style>
