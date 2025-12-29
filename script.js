let words = []
let WORD_LIMIT = 30
let TIME_LIMIT = 25
fetch('./words.json')
  .then(response => response.json())
  .then(data => {
    words = data.words.slice(0,WORD_LIMIT)
    console.log('words loaded:',words.length)
    shuffleWords()
    init()
  })
  .catch(error => {
    console.error('Error loading words: ',error)
    alert('could not load words.json file')
  })


function shuffleWords(){
  for(let i = words.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1))
    const temp = words[i]
    words[i] = words[j]
    words[j] = temp
  }
}



let gameState = {
  currentWordIndex:0,
  typedWords:[],
  startTime: null,
  isActive:false,
  correctChars:0,
  totalChars:0,
  timerInterval: null
}

const typingInput = document.getElementById('typingInput')
const wordsContainer = document.getElementById('wordsContainer')
const resetBtn = document.getElementById('resetBtn')
const wpmDisplay = document.getElementById('wpm')
const accuracyDisplay = document.getElementById('accuracy')
const timeDisplay = document.getElementById('time')

function init(){
  displayWords()
  typingInput.focus()
}

function displayWords(){
  wordsContainer.innerHTML = ''
  words.forEach((word,index)=>{
    const wordDiv = document.createElement('div')
    wordDiv.textContent = word 
    wordDiv.className = 'word'

    if(index === gameState.currentWordIndex){
      wordDiv.classList.add('current')
    }

    else if(index < gameState.currentWordIndex){

      if(gameState.typedWords[index] === word){
        wordDiv.classList.add('correct')
      }
      else{
        wordDiv.classList.add('incorrect')
      }
    }

    wordsContainer.appendChild(wordDiv)
  })
}

function startTimer(){
  gameState.timerInterval =  setInterval(()=>{
    const elapsedSeconds = (Date.now() - gameState.startTime)/1000

    if(elapsedSeconds >= TIME_LIMIT || gameState.currentWordIndex >= words.length){
      endTest()
      return
    }


    timeDisplay.textContent = Math.floor(TIME_LIMIT - elapsedSeconds) + 's'
  },100)
}


function handleInput(event){

  const input = event.target.value

  if(!gameState.isActive && input.length > 0){
    gameState.isActive = true
    gameState.startTime = Date.now()
    startTimer()
  }

  if(input.endsWith(' ')){
    const typedWord = input.trim()
    gameState.typedWords.push(typedWord)
    gameState.currentWordIndex++
    typingInput.value = ''
    
    if(gameState.currentWordIndex >= words.length){
      endTest()
      return
    }

    displayWords()
    // updateStats()
  }
}

function updateStats(){
if(!gameState.isActive || gameState.startTime === null){
  return
}

const elapsedSeconds = (Date.now() - gameState.startTime)/1000
const elapsedMinutes = elapsedSeconds / 60

const wpm = Math.round((gameState.currentWordIndex/elapsedMinutes) || 0)

let correctWords = 0
for(let i = 0 ; i < gameState.typedWords.length ; i++){
  if(gameState.typedWords[i] === words[i]){
    correctWords++
  }
}

const accuracy = gameState.typedWords.length > 0
? Math.round((correctWords / gameState.typedWords.length) * 100)
: 100

wpmDisplay.textContent = wpm
accuracyDisplay.textContent = accuracy + '%'
timeDisplay.textContent = Math.floor(elapsedSeconds) + 's'
}

function endTest(){
  updateStats()
  gameState.isActive = false
  typingInput.disabled = true
  typingInput.placeholder = 'Test finished! Click reset to try again. '
  
}

function resetTest(){
  clearInterval(gameState.timerInterval)

  gameState = {
    currentWordIndex: 0,
    typedWords: [],
    startTime: null,
    isActive: false,
    correctChars: 0,
    totalChars: 0,
    timerInterval:null
  }

  typingInput.value = ''
  typingInput.disabled = false
  typingInput.placeholder = 'Click here and start typing....'
  typingInput.focus()

  wpmDisplay.textContent = '0'
  accuracyDisplay.textContent = '100%'
  timeDisplay.textContent = TIME_LIMIT + 's'

  shuffleWords()
  displayWords()
}

typingInput.addEventListener('input',handleInput)
resetBtn.addEventListener('click',resetTest)

init()