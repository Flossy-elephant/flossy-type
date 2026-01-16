let words = []

let TIME_LIMIT = 30


fetch("englishSentences.json")
  .then(response => response.json())
  .then(data => {
    const sentences = Object.values(data).map(item => item.val)
    const randomSentences = getRandomSentences(sentences,5)
    words = randomSentences
    .join(' ')
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => cleanWord(word))
    console.log('Final words:', words) 
    init()
  })
  .catch(error => console.error('error:',error))


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
      wordDiv.textContent = ''

      const typedLength  = typingInput.value.length
      const typedWord = typingInput.value

      for(let i = 0; i < word.length ; i++){
          if(i === typedLength){
            const cursor = document.createElement('span')
            cursor.className = 'cursor'
            wordDiv.appendChild(cursor)
          }

          const letterSpan =  document.createElement('span')
          letterSpan.textContent = word[i]
          letterSpan.className = 'letter'

          if(i < typedLength){
            if(word[i] === typedWord[i]){
              letterSpan.classList.add('letter-correct')
            }else{
              letterSpan.classList.add('letter-incorrect')
            }
          }
          
          wordDiv.appendChild(letterSpan)

          
      }
      if(typedLength >= word.length){
        const cursor = document.createElement('span')
        cursor.className = 'cursor'
        wordDiv.appendChild(cursor)
      }
      
    }
    else{
      wordDiv.textContent = word
      if(index < gameState.currentWordIndex){
        if(gameState.typedWords[index] === word){
          wordDiv.classList.add('correct')
        }
        else{
          wordDiv.classList.add('incorrect')
        }
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
    document.body.classList.add('test-active')
    startTimer()
  }

  displayWords()


  if(input.endsWith(' ')){
    const typedWord = input.trim()
    
    if(gameState.typedWords.length === gameState.currentWordIndex){
      gameState.typedWords[gameState.currentWordIndex] = typedWord
    }else{
      gameState.typedWords.push(typedWord)
    }

    gameState.currentWordIndex++
    typingInput.value = ''
    
    if(gameState.currentWordIndex >= words.length){
      endTest()
      return
    }

    displayWords()

  }
}

typingInput.addEventListener('keydown',(event)=>{
  if(event.key === 'Backspace'){
    setTimeout(()=>{
      const  input = typingInput.value
      
        if(input.length === 0 && gameState.currentWordIndex > 0){
          gameState.currentWordIndex--
          gameState.typedWords.pop()
          displayWords()
      }
    },0)
  }
})

document.addEventListener('click', () => {
  if(gameState.isActive){  
    typingInput.focus()
  }
})

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
: null

wpmDisplay.textContent = wpm
accuracyDisplay.textContent = accuracy + '%'
timeDisplay.textContent = Math.floor(elapsedSeconds) + 's'
}

function endTest(){
  updateStats()
  document.body.classList.remove('test-active')
  document.body.classList.add('test-finished')
  gameState.isActive = false
  typingInput.disabled = true
  typingInput.placeholder = 'Test finished! Click reset to try again. '
  
}

function resetTest(){
  document.body.classList.remove('test-finished')
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


  displayWords()
}

typingInput.addEventListener('input',handleInput)
resetBtn.addEventListener('click',resetTest)

init()

function getRandomSentences(array,count){
  const shuffled = [...array].sort(()=>0.5 - Math.random())
  return shuffled.slice(0,count)
}

function cleanWord(word){
  return word.replace(/[.,!?;:"'-]/g, '').toLowerCase()
}