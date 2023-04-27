const cells = [
  { i: 1 },
  { i: 2 },
  { i: 3 },
  { i: 4 }
]

function isEmpty(cell) {
  return (cell.i > 1) ? true : false
}

const emptyCells = cells.filter((cell) => isEmpty(cell))
const randomIndex = Math.random() * emptyCells.length

console.log(randomIndex)
console.log(Math.floor(randomIndex))