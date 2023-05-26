var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var score = 0
var PLAY = 1
var END = 0
var gameState = PLAY
var naveInimiga

function preload() {
  bgImg = loadImage("assets/bg.png")
  restartImg = loadImage("assets/sprite_restart0.png")
  cleitinhoImg = loadAnimation("assets/cleitinho1.png", "assets/cleitinho2.png", "assets/cleitinho3.png", "assets/cleitinho4.png")
  meteoritoImg = loadAnimation("assets/meteorito/sprite_meteorito0.png", "assets/meteorito/sprite_meteorito1.png", "assets/meteorito/sprite_meteorito2.png", "assets/meteorito/sprite_meteorito3.png")
  cometaImg = loadAnimation("assets/cometa/sprite_cometa0.png", "assets/cometa/sprite_cometa1.png", "assets/cometa/sprite_cometa2.png", "assets/cometa/sprite_cometa3.png", "assets/cometa/sprite_cometa4.png", "assets/cometa/sprite_cometa5.png")
  naveInimigaImg = loadImage("assets/nave inimiga/sprite_nave0.png")
  explosao = loadSound("assets/explosion.mp3")
  explosion = loadAnimation("assets/explosion/explosion0.png", "assets/explosion/explosion1.png", "assets/explosion/explosion2.png", "assets/explosion/explosion3.png", "assets/explosion/explosion4.png", "assets/explosion/explosion5.png", "assets/explosion/explosion6.png", "assets/explosion/explosion7.png", "assets/explosion/explosion8.png")

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //criando canto superior e inferior
  bottomGround = createSprite(width / 2, height, height * 2, 20);
  // bottomGround.visible = false;
  topGround = createSprite(width / 2, height - height, height * 2, 20);
  // topGround.visible = false;

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg)
  restart.visible = false
  restart.scale = 0.5

  //criando o cleitinho  
  cleitinho = createSprite(100, 200, 20, 50);
  cleitinho.addAnimation("cleitinho", cleitinhoImg);
  cleitinho.addAnimation("explosao", explosion)
  cleitinho.scale = 5;
  cleitinho.setCollider("circle", 0, 5, 10)
  // cleitinho.debug = true


  meteoritoGroup = new Group()
  cometaGroup = new Group()
  naveInimigaGroup = new Group()
  barraGroup = new Group()


}

function draw() {

  background(255);
  image(bgImg, 0, 0, width, height)

  if (gameState == PLAY) {

    if (keyDown("space")) {
      cleitinho.velocityY = -8;
    }
    cleitinho.velocityY = cleitinho.velocityY + 0.8;

    if (naveInimigaGroup.isTouching(topGround)) {
      for (var i = 0; i < naveInimigaGroup.length; i++) {
        if (naveInimigaGroup[i].isTouching(topGround)) {
          naveInimigaGroup[i].velocityY *= -1
        }
      }
    }
    if (naveInimigaGroup.isTouching(bottomGround)) {
      for (var i = 0; i < naveInimigaGroup.length; i++) {
        if (naveInimigaGroup[i].isTouching(bottomGround)) {
          naveInimigaGroup[i].velocityY *= -1
        }
      }
    }

    if (meteoritoGroup.isTouching(cleitinho) ||
      naveInimigaGroup.isTouching(cleitinho) ||
      cometaGroup.isTouching(cleitinho) ||
      bottomGround.isTouching(cleitinho) ||
      topGround.isTouching(cleitinho)) {
      cleitinho.changeAnimation("explosao")
      cleitinho.scale = 0.5
      explosao.play()
      gameState = END
    }
    // chamada das funções
    Score()
    handleCometa()
    handleMeteoritoTop()
    handleMeteoritoDown()
    handleNaveInimiga()
    Barra()
  } //fim do estado PLAY

  if (gameState === END) {
    cleitinho.y = 400
    barraGroup.setVelocityXEach(0)
    barraGroup.destroyEach()

    meteoritoGroup.setVelocityXEach(0)
    meteoritoGroup.setLifetimeEach(-1)

    naveInimigaGroup.setVelocityXEach(0)
    naveInimigaGroup.setVelocityYEach(0)
    naveInimigaGroup.setLifetimeEach(-1)

    cometaGroup.setVelocityXEach(0)
    cometaGroup.setVelocityYEach(0)
    cometaGroup.setLifetimeEach(-1)

    restart.visible = true

    if (mousePressedOver(restart)) {
      reset()
    }
  }



  drawSprites();
  textSize(45)
  fill("red")
  text("Pontuação: " + score, 140, 80)

}

function reset() {
  gameState = PLAY
  restart.visible = false
  meteoritoGroup.destroyEach()
  naveInimigaGroup.destroyEach()
  cometaGroup.destroyEach()
  cleitinho.changeAnimation("cleitinho", cleitinhoImg)
  cleitinho.scale = 5;
  score = 0

}

// meteoro = cano
function handleMeteoritoTop() {
  if (frameCount % 150 === 0) {
    meteoritotop = createSprite(width - 100, random(height / 2 - 100, height / 2 - 300), 50, 50)
    meteoritotop.addAnimation("meteor", meteoritoImg)
    meteoritotop.scale = random(0.4, 0.8)
    meteoritotop.velocityX = -(6 + 3 * score / 100);
    meteoritotop.setCollider("circle", 0, 0, 120)
    // meteoritotop.debug = true
    meteoritotop.lifetime = 800
    meteoritoGroup.add(meteoritotop)
  }
}

function handleMeteoritoDown() {
  if (frameCount % 150 === 0) {
    meteoritodown = createSprite(width - 100, random(height / 2 + 100, height / 2 + 300), 50, 50)
    meteoritodown.addAnimation("meteor", meteoritoImg)
    meteoritodown.scale = random(0.4, 0.8)
    meteoritodown.velocityX = -(6 + 3 * score / 100);
    meteoritodown.setCollider("circle", 0, 0, 120)
    // meteoritodown.debug = true
    meteoritodown.lifetime = 300
    meteoritoGroup.add(meteoritodown)
  }
}

function handleCometa() {
  if (frameCount % 178 === 0) {
    cometa = createSprite(width / 4 + random(170, 200), height - height, height * 2 - 100, 20, 50, 50)
    cometa.addAnimation("asteroide", cometaImg)
    cometa.scale = 0.6
    cometa.velocityY = random(2, 5)
    cometa.velocityX = random(-3, -5)
    cometa.lifetime = 300
    cometa.setCollider("rectangle", 0, -20, 280, 80, -40)
    // cometa.debug = true
    cometaGroup.add(cometa)
  }
}



function handleNaveInimiga() {
  if (frameCount % 178 === 0) {
    naveInimiga = createSprite(width - 100, height / 2, 50, 50)
    naveInimiga.addAnimation("naveInimiga", naveInimigaImg)
    naveInimiga.scale = 0.6
    naveInimiga.setCollider("rectangle", 0, 0, 80, 190)
    // naveInimiga.debug = true
    naveInimiga.velocityY = random(-10, 10)
    naveInimiga.velocityX = -10
    naveInimiga.lifetime = 200
    naveInimigaGroup.add(naveInimiga)
  }
}

function Barra() {
  if (frameCount % 150 === 0) {
    var barra = createSprite(width - 100, height, 10, height * 2)
    barra.velocityX = -5
    barra.visible = false
    barraGroup.add(barra)
  }
}

function Score() {
  if (cleitinho.isTouching(barraGroup)) {
    for (i = 0; i < barraGroup.length; i++) {
      if (barraGroup[i].isTouching(cleitinho)) {
        barraGroup[i].destroy()
      }
    }
    score = score + 10

  }
}