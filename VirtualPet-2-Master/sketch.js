//Create variables here
var dog,dogImg1,dogImg2;
var database;
var foodS,foodStock;
var fedTime, lastFed, addFood, foodObj;
var readGameState, updateGameState;
var bedroom,garden,washroom;

function preload(){
   dogImg1=loadImage("dogImg.png");
   dogImg2=loadImage("dogImg1.png");
   bedroom=loadImage("Bed Room.png");
   garden=loadImage("Garden.png");
   washroom=loadImage("Wash Room.png");
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  dog=createSprite(800,200,150,150);
  dog.addImage(dogImg1);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readGameState=database.ref('gameState');
  readGameState.on("value",function(data){
    gameState=data.val();
  });

}


// function to display UI
function draw() {
  background(46,139,87);
  foodObj.display();
 
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(dogImg2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })

if(gameState=="hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
  
}else{
  feed.show();
  addFood.show();
  dog.addimage(sadDog);  
}

currentTime=hour();
if(currentTime==(lastFed+1)){
  update("playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
  update("bathing");
  foodObj.washroom();
}else{
  update("hungry");
  foodObj.display();
}

function update(updateGameState){
  database.ref('/').update({
    gameState:updateGameState
  })
}

}