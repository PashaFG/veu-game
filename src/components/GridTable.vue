<script setup>
// @ts-nocheck
import TileElement from './TileElement.vue';
import { reactive, computed, onMounted } from 'vue';
const props = defineProps({
  gridSize: Number,
  cellsCount: Number
})

const cells = reactive([])
let tiles = reactive([])

/* Group cell in row/column */

const cellsGroupedByColumn = computed(() => cells.reduce((groupedCells, cell) => {
  groupedCells[cell.x] = groupedCells[cell.x] || []
  groupedCells[cell.x][cell.y] = cell
  return groupedCells
}, []))
const cellsGroupedByReversedColumn = computed(() => cellsGroupedByColumn.value.map(column => [...column].reverse()))
const cellsGroupedByRow = computed(() => cells.reduce((groupedCells, cell) => {
  groupedCells[cell.y] = groupedCells[cell.y] || []
  groupedCells[cell.y][cell.x] = cell
  return groupedCells
}, []))
const cellsGroupedByReversedRow = computed(() => cellsGroupedByRow.value.map(column => [...column].reverse()))

/* Logic set/merge/delete tile */

function isEmpty(cell) {
  if (tiles.length > 0 && tiles.find((tile) => tile.linkedCell === cell.i)) { return false }
  return true
}

function getRandomEmptyCell() {
  const emptyCells = cells.filter(cell => isEmpty(cell))
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  return emptyCells[randomIndex]
}

function setNewTile() {
  const cell = getRandomEmptyCell()
  tiles.push({
    id: Date.now(),
    linkedCell: cell.i,
    x: cell.x,
    y: cell.y,
    value: Math.random() > 0.3 ? 2 : 4
  })
}

function removeTile(index) {
  if (index > -1) { tiles.splice(index, 1) }
}

function canAccept(tileToMove, tileToMerge) {
  if (!tileToMerge) { return true }
  if (tileToMerge.isPrepareToDelete) { return false }
  return (tileToMove.value === tileToMerge.value) ? (!tileToMove.isMerging || !tileToMerge.isMerging) ? true : false : false
}

function mergeTiles(tileToMove, tileToMerge) {
  console.log(`[mergeTiles] merged tiles: ${tileToMove.id} and ${tileToMerge.id}`)
  tileToMove.value = tileToMove.value + tileToMerge.value
  tileToMerge.isPrepareToDelete = true
  removeTile(tiles.indexOf(tileToMerge))
  // document.getElementById(tileToMerge.id).remove()
}

/* Logic move Tile */

async function slideTilesInGroup(group, promises) {
  console.log('[slideTilesInGroup] start group')
  for (let i = 0; i < group.length; i++) {
    if (isEmpty(group[i])) { continue }
    const tile = tiles.find((tile) => tile.linkedCell === group[i].i)
    let targetCell
    let j = i - 1
    while (j >= 0 && canAccept(tile, tiles.find((tile) => tile.linkedCell === group[j].i))) {
      if (j >= 1 && group[j - 1].isPrepareToDelete) { continue }
      targetCell = group[j]
      j--
    }

    if (!targetCell) { continue }
    tile.x = targetCell.x
    tile.y = targetCell.y
    promises.pop()
    await waitForTransitionEnd(tile, promises)
    if (!isEmpty(targetCell)) {
      mergeTiles(tile, tiles.find((tile) => tile.linkedCell === targetCell.i, promises))
    }
    tile.linkedCell = targetCell.i
  }
  console.log('[slideTilesInGroup] end group')
}

async function moveUp(promises) {
  for (let i = 0; i < cellsGroupedByColumn.value.length; i++) {
    console.log(`[moveUp] start group ${i + 1}`)
    await slideTilesInGroup(cellsGroupedByColumn.value[i], promises)
  }
}
async function moveDown(promises) {
  for (let i = 0; i < cellsGroupedByReversedColumn.value.length; i++) {
    console.log(`[moveUp] start group ${i + 1}`)
    await slideTilesInGroup(cellsGroupedByReversedColumn.value[i], promises)
  }
}
async function moveLeft(promises) {
  for (let i = 0; i < cellsGroupedByRow.value.length; i++) {
    console.log(`[moveUp] start group ${i + 1}`)
    await slideTilesInGroup(cellsGroupedByRow.value[i], promises)
  }
}
async function moveRight(promises) {
  for (let i = 0; i < cellsGroupedByReversedRow.value.length; i++) {
    console.log(`[moveUp] start group ${i + 1}`)
    await slideTilesInGroup(cellsGroupedByReversedRow.value[i], promises)
  }
}


/* Input */

function setupInput() {
  console.log('[setupInput] key pressed')
  window.addEventListener("keydown", handleInput, { once: true })
  console.log('[setupInput] end event')
}

async function handleInput(event) {
  console.log(`[handleInput] press: ${event.key}`)
  const promises = []
  switch (event.key) {
    case "ArrowUp":
      await moveUp(promises)
      break;
    case "ArrowDown":
      await moveDown(promises)
      break;
    case "ArrowLeft":
      await moveLeft(promises)
      break;
    case "ArrowRight":
      await moveRight(promises)
      break;

    default:
      setupInput()
      return
  }
  console.log(promises)
  if (promises.length > 0) {
    await Promise.all(promises)
    setNewTile()
  }

  setupInput()
}


async function waitForTransitionEnd(tile, promises) {
  const element = document.getElementById(tile.id)
  await promises.push(new Promise(resolve =>
    element.addEventListener("transitionend", resolve, { once: true })
  ))
}

/* Mounted */

onMounted(() => {
  for (let i = 0; i < props.cellsCount; i++) {
    cells.push({
      i: i,
      x: i % props.gridSize,
      y: Math.floor(i / props.gridSize),
    })
  }

  setNewTile()
  setupInput()
})
</script>
<template>
  <div @keydown="setupInput($event)">
    <div class="cell"
      v-for="cell in cells"
      :key="cell.i">
    </div>
    <TileElement v-for="tile in tiles"
      :id="tile.id"
      :key="tile.id"
      :value="tile.value"
      :x="tile.x"
      :y="tile.y" />
  </div>
</template>
<style scoped>
div {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, var(--cell-size));
  grid-template-rows: repeat(4, var(--cell-size));
  gap: var(--cell-gap);
  border: 1vmin;
}

.cell {
  background-color: #444;
  border-radius: 1vmin;
}
</style>