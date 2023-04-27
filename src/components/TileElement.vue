<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  value: Number,
  x: Number,
  y: Number,
})

const bgLightness = computed(() => 100 - Math.log2(props.value) * 9)
</script>
<template>
  <div class="tile"
    :style="{ '--x': x, '--y': y, '--bg-lightness': `${bgLightness}%`, '--text-lightness': `${bgLightness < 50 ? 90 : 10}%` }">
    {{ value }}
  </div>
</template>
<style scoped>
.tile {
  --y: 0;
  --x: 0;
  --bg-lightness: 0;
  --text-lightness: 0;

  position: absolute;
  top: calc(var(--y) * (var(--cell-size) + var(--cell-gap)));
  left: calc(var(--x) * (var(--cell-size) + var(--cell-gap)));

  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--cell-size);
  height: var(--cell-size);

  border-radius: 1vmin;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 7.5vmin;
  font-weight: bold;
  background-color: hsl(25, 60%, var(--bg-lightness));
  color: hsl(20, 25%, var(--text-lightness));
  transition: 300ms;
  animation: show 300ms;
}

@keyframes show {
  0% {
    opacity: 0.5;
    transform: scale(0);
  }
}
</style>