import { sleep } from "./helpers/util.js";
import { SortingAlgorithms } from "./helpers/sortingAlgorithms.js";

let nBars = 15

let numbersBars = document.getElementById('numbersBars')

const stage = document.getElementById('stage')
stage.style.width = `${nBars * 30}px`

const selectAlgorithm = document.getElementById('selectAlgorithm')

const generateBtn = document.getElementById('generateBtn')
const solveBtn = document.getElementById('solveBtn')

let bars = []
let barsDivs = []

const sortingAlgorithms = new SortingAlgorithms({})

const start = () => {
  stage.innerHTML = ''

  bars = Array(nBars).fill(0).map(_ => {
    return {
      width: 20,
      height: Math.floor(Math.random() * 200) + 1
    }
  })

  barsDivs = []

  for (let i = 0; i < bars.length; i++) {
    const bar = document.createElement('div');
    bar.style.width = `${bars[i].width}px`;
    bar.style.height = `${bars[i].height}px`;
    bar.style.left = `${5 + i * 30}px`;
    bar.classList.add('bar');

    // Create a label to show the height value
    const label = document.createElement('span');
    label.innerText = bars[i].height;
    label.style.position = 'absolute';
    label.style.bottom = '100%'; // Position above the bar
    label.style.left = '50%';
    label.style.transform = 'translateX(-50%)';
    label.style.color = 'black';
    label.style.fontSize = '12px';

    bar.appendChild(label); // Add the label inside the bar

    bars[i] = { ...bars[i], position: i };
    barsDivs.push(bar);
    stage.appendChild(bar);
  }
}

start()

async function swapBars(barsDivs, i, j) {
  // Move bars visually
  barsDivs[i].style.left = `${5 + j * 30}px`;
  barsDivs[i].classList.add('activate');
  barsDivs[j].style.left = `${5 + i * 30}px`;
  barsDivs[j].classList.add('activate');

  // Wait for animation to complete
  await sleep(1000);

  // Remove highlight effect
  barsDivs[i].classList.remove('activate');
  barsDivs[j].classList.remove('activate');

  // ✅ Swap the actual elements in the DOM
  let parent = barsDivs[i].parentNode;  // Get parent container
  parent.insertBefore(barsDivs[j], barsDivs[i]);  // Swap positions in DOM

  // ✅ Swap references in the array
  let temp = barsDivs[i];
  barsDivs[i] = barsDivs[j];
  barsDivs[j] = temp;
}


const algorithms = [
  sortingAlgorithms.bubbleSort,
  sortingAlgorithms.selectionSort,
  sortingAlgorithms.insertionSort,
  // sortingAlgorithms.mergeSort,
  sortingAlgorithms.quickSort
]

const solve = async () => {
  const array = structuredClone(bars.map(el => el.height))

  const swaps = algorithms[selectAlgorithm.selectedIndex](array)

  for (let i = 0; i < swaps.length; i++) {
    if (swaps[i].firstPostion !== swaps[i].lastPosition) {
      await swapBars(barsDivs, swaps[i].firstPostion, swaps[i].lastPosition)
    }
  }
}

generateBtn.addEventListener('click', () => {
  nBars = parseInt(numbersBars.value, 10)
  if(nBars > 25 || nBars <1 || isNaN(nBars))
  {
    alert("Array size must be between 1 and 25")
  }
  else{
    stage.style.width = `${nBars * 30}px`
    start()
}
})

solveBtn.addEventListener('click', () => {
  solve()
})