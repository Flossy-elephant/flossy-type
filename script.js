const words =[
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
  'javascript', 'is', 'fun', 'typing', 'test', 'speed', 'practice',
  'keyboard', 'challenge', 'accuracy', 'performance', 'learn'
]

let gameState = {
  currentWordIndex:0,
  typedWords:[],
  startTime: null,
  isActive:false,
  correctChars:0,
  totalChars:0
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

function handleInput(event){

  const input = event.target.value

  if(!gameState.isActive )
}