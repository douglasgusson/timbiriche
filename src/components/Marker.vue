<script lang="ts" setup>
import { computed } from "vue";
import { useScale } from "@/composables/scale";
import type Box from "@/models/Box";

const props = defineProps<{
  box: Box;
  fillColor: string;
  textContent: string;
}>();

const { scale } = useScale();

const circlePosition = computed(() => {
  const { x, y } = props.box.initialPoint;
  return {
    x: x * scale.value + scale.value / 2,
    y: y * scale.value + scale.value / 2,
  };
});

const textPosition = computed(() => {
  const { x, y } = props.box.initialPoint;
  return {
    x: x * scale.value + scale.value / 2,
    y: y * scale.value + scale.value / 2,
  };
});
</script>

<template>
  <circle
    :cx="circlePosition.x"
    :cy="circlePosition.y"
    :r="scale / 3"
    :fill="fillColor"
  />
  <text
    class="text-content"
    :x="textPosition.x"
    :y="textPosition.y"
    fill="white"
    alignment-baseline="middle"
    text-anchor="middle"
    dy=".35em"
    >{{ textContent }}</text
  >
</template>

<style scoped>
.text-content {
  font-size: 1.4rem;
  font-weight: 600;
}
</style>
