<script setup>
import GridTable from './components/GridTable.vue';
const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;
</script> 

<template>
  <GridTable :gridSize="GRID_SIZE"
    :cellsCount="CELLS_COUNT">
  </GridTable>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  --cell-size: 20vmin;
  --cell-gap: 2vmin;
  background-color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
