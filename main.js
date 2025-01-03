const canvas = document.querySelector('canvas');
const pointsDOMElement = document.querySelector('.points-value');
const pointsContainerDOMElement = document.querySelector('.points-container');
const releaseXatronsButton = document.querySelector('.release-xatrons');
const wishDOMElement = document.querySelector('.wish-container');
const wishToggleButtonDOMElement = document.querySelector('.wish-toggle-button');
const moreXatronsButtonDOMElement = document.querySelector('.more-xatrons-button');



const c = canvas.getContext('2d');

const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight


const avatarImage = new Image();
const avatarSize = 70
avatarImage.src = 'Seba.png'

const gameSettings = {
    initialSpriteCount: (canvas.width / avatarSize) * (canvas.height / avatarSize) / 4
}

const gameState = {
    score: 0,
    sprites: []
}

let requestCreateMoreXatrons = false

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
})

function randomIntFromInterval(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomNumberFromInterval(min, max) { 
    return Math.random() * (max - min) + min;
}

function vec2(x,y){
    this.x = x
    this.y = y
}

function Sprite(x, y, speedMultipler, direction){
    this.x = x
    this.y = y
    this.speed = 5
    this.speedMultipler = speedMultipler
    this.direction = direction
    this.size = avatarSize
    this.image = avatarImage
}

function createSprite(){
    const x = randomIntFromInterval(0, canvas.width - avatarSize)
    const y = randomIntFromInterval(0, canvas.height - avatarSize) 
    const speedMultipler = randomNumberFromInterval(0.4,0.9)
    const direction = new vec2(randomNumberFromInterval(-1,1), randomNumberFromInterval(-1, 1))
    return new Sprite(x, y, speedMultipler, direction)
}

window.addEventListener('click', (e) => {
    const clickedSprites = gameState.sprites.filter(s => s.x < mouse.x && s.x + s.size > mouse.x && s.y < mouse.y && s.y + s.size > mouse.y)

    clickedSprites.forEach(spriteToRemove =>{
        const idx = gameState.sprites.indexOf(spriteToRemove)
        gameState.sprites.splice(idx, 1)
    })
    gameState.score += clickedSprites.length

    pointsDOMElement.innerHTML = gameState.score
})

releaseXatronsButton.addEventListener('click', (e) => {
    releaseXatronsButton.disabled = true
    startGame()
})

wishToggleButtonDOMElement.addEventListener('click', (e) => {
    if(wishDOMElement.style.display == 'flex'){
        wishDOMElement.style.display = 'none'
    }
    else {
        wishDOMElement.style.display = 'flex'
    }
})

moreXatronsButtonDOMElement.addEventListener('click', e => {
 requestCreateMoreXatrons = true;
})

function startGame(){
    wishDOMElement.style.display = 'none'
    wishToggleButtonDOMElement.style.display = 'block'
    pointsContainerDOMElement.style.display = 'block'
    moreXatronsButtonDOMElement.style.display = 'block'

    for(let i = 0; i < gameSettings.initialSpriteCount; i++){
        gameState.sprites.push(createSprite())
    }

    window.requestAnimationFrame(loop)
}

/*
Needs to be called from within animaiomFrame loop
*/
function moreXatrons(){
    for(let i = 0; i < 10; i++){
        gameState.sprites.push(createSprite())
    }
}

function loop(){
    c.clearRect(0,0,canvas.width,canvas.height)
    // c.fillText('HTML Canvas', mouse.x, mouse.y)

    if(requestCreateMoreXatrons){
        requestCreateMoreXatrons = false;
        moreXatrons()
    }

    if(gameState.sprites.length === 0){
        releaseXatronsButton.disabled = false
        wishDOMElement.style.display = 'flex'
        moreXatronsButtonDOMElement.style.display = 'none'
        wishToggleButtonDOMElement.style.display = 'none'
        return
    }

    gameState.sprites.forEach(sprite => {
        sprite.x += (sprite.speed ) * sprite.direction.x
        sprite.y += (sprite.speed ) * sprite.direction.y

        if(sprite.y < 0 || sprite.y > canvas.height - avatarSize){
            sprite.direction.y = -sprite.direction.y
        } 
        if(sprite.x < 0 || sprite.x > canvas.width - avatarSize){
            sprite.direction.x = -sprite.direction.x
        } 

        c.drawImage(sprite.image, sprite.x, sprite.y)
    });

    window.requestAnimationFrame(loop)
}

