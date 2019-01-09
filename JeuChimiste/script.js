var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platforms;
var cursors;
var isValid;
var arrayItemSelected = [];
var ingredients;
var id = 0;
var potionsRandom = [];

function include(fileName){
    document.write("<script type='text/javascript' src='"+fileName+"'></script>" );
  }

include('positions.js');
include('potions.js');


var arrayNameIngredients = ['CrochetsDeSerpent', 'CireBougieNoir', 'CuirDeBumslangWikiputer', 'OeufDeDragon',
                            'epineDePoissonDiable', 'Herbicide', 'foieDeDragon', 'jusDeSauterelle',
                            'plumeJobarbille'];

var arrayNamePotions = ["potionContreMauvaisOeil", "PotionDeBeaute", "potionDeGuerison", "potionDePoison",
                        "potionDePuissance", "PotionDeVieillessement", "PotionSommeilSansReve", "potionVision"];

var ingredientsOnThMap = arrayNameIngredients.slice();

function preload() {
    game.load.image('background', 'assets/header2.png');
    game.load.image('footer', 'assets/footer2.png');
    game.load.image('smallSuspend', 'assets/smallSuspend.png');
    game.load.image('bigSuspend', 'assets/bigSuspend.png');
    game.load.image('stockage', 'assets/stockage.png');
    game.load.image('CireBougieNoir', 'assets/ingredients/CireBougieNoir.png');
    game.load.image('CrochetsDeSerpent', 'assets/ingredients/CrochetsDeSerpent.png');
    game.load.image('CuirDeBumslangWikiputer','assets/ingredients/CuirDeBumslangWikiputer.png');
    game.load.image('potionContreMauvaisOeil', 'assets/potions/potionContreMauvaisOeil.png');
    game.load.image('PotionDeBeaute', 'assets/potions/PotionDeBeaute.png');
    game.load.image('potionDeGuerison', 'assets/potions/potionDeGuerison.png');
    game.load.image('potionDePoison', 'assets/potions/potionDePoison.png');
    game.load.image('potionDePuissance', 'assets/potions/potionDePuissance.png');
    game.load.image('PotionDeVieillessement', 'assets/potions/PotionDeVieillessement.png');
    game.load.image('PotionSommeilSansReve', 'assets/potions/PotionSommeilSansReve.png');
    game.load.image('potionVision','assets/potions/potionVision.png');
    game.load.image('corbeille','assets/corbeille.png');
    game.load.image('OeufDeDragon', 'assets/ingredients/OeufDeDragon.png');
    game.load.image('epineDePoissonDiable', 'assets/ingredients/epineDePoissonDiable.png');
    game.load.image('Herbicide', 'assets/ingredients/Herbicide.png');
    game.load.image('foieDeDragon', 'assets/ingredients/foieDeDragon.png');
    game.load.image('jusDeSauterelle', 'assets/ingredients/jusDeSauterelle.png');
    game.load.image('plumeJobarbille', 'assets/ingredients/plumeJobarbille.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('marmite', 'assets/marmiteGreenSprite.png', 77, 100);

}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0,0,'background');
    platforms = game.add.group();
    platforms.enableBody = true;

    var footer = platforms.create(0, 610, 'footer');
    footer.body.immovable = true;

    var smallSuspend = platforms.create(350,370, 'smallSuspend');
    smallSuspend.body.immovable = true;

    var bigSuspend1 = platforms.create(0,440, 'bigSuspend');
    bigSuspend1.body.immovable = true;

    var bigSuspend2 = platforms.create(540,330, 'bigSuspend');
    bigSuspend2.body.immovable = true;

    var smallSuspend2 = platforms.create(830,370, 'smallSuspend');
    smallSuspend2.body.immovable = true;

    var bigSuspend3 = platforms.create(1090,440, 'bigSuspend');
    bigSuspend3.body.immovable = true;

    game.add.sprite(500, 660, 'stockage');

    ingredients = game.add.group();
    ingredients.enableBody = true;

    potions = game.add.group();
    potions.enableBody = true;

    itemSelected = game.add.group();
    itemSelected.enableBody = true;

    materials = game.add.group();
    materials.enableBody = true;

    spawnElements(ingredients, arrayPositionIngredientOnTheMap, arrayNameIngredients);
    materials.create(600,520, 'marmite');
    materials.create(500, 570, 'corbeille');

    marmite = game.add.sprite(600, 520, 'marmite');
    player = game.add.sprite(32, game.world.height - 300, 'dude');

    game.physics.arcade.enable(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    marmite.animations.add('enter', [0,1,2], 10, true);

    setInterval(function(){ 
        generateOtherPositionIngredient(ingredients); 
    }, 5000);

    potionsRandom = generatePotions();
    console.log(potionsRandom);

    spawnElements(potions, positionPotions, potionsRandom);
}

function update() {

    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(ingredients, platforms);
    game.physics.arcade.collide(marmite, platforms);

    game.physics.arcade.overlap(player, ingredients, chooseingredient, null, this);
    game.physics.arcade.overlap(player, materials, chooseingredient, null, this);

    player.body.velocity.x = 0;

    if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
        player.body.velocity.x = -150;
        player.animations.play('left');
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            player.body.velocity.y = 1610;
        }
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
        player.body.velocity.x = 150;
        player.animations.play('right');
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            player.body.velocity.y = 1500;
        }
    }else if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        player.body.velocity.y = 1610;
    }
    else{
        player.animations.stop();
        player.frame = 4;
    }
}

function chooseingredient(player, item)
{
    if(game.input.keyboard.justPressed(Phaser.Keyboard.ENTER))
    {
        switch(item.key)
        {
            case 'CrochetsDeSerpent':
                addItemInInventory('CrochetsDeSerpent');
                item.kill();
                break;
            case 'CireBougieNoir':
                addItemInInventory('CireBougieNoir');
                item.kill();
                break;
            case 'CuirDeBumslangWikiputer':
                addItemInInventory('CuirDeBumslangWikiputer');
                item.kill();
                break;
            case 'OeufDeDragon':
                addItemInInventory('OeufDeDragon');
                item.kill();
                break;
            case 'epineDePoissonDiable':
                addItemInInventory('epineDePoissonDiable');
                item.kill();
                break;
            case 'Herbicide':
                addItemInInventory('Herbicide');
                item.kill();
                break;
            case 'foieDeDragon':
                addItemInInventory('foieDeDragon');
                item.kill();
                break;
            case 'jusDeSauterelle':
                addItemInInventory('jusDeSauterelle');
                item.kill();
                break;
            case 'plumeJobarbille':
                addItemInInventory('plumeJobarbille');
                item.kill();
                break;
            case 'marmite':
                animationMarmite();
                break;
            case 'corbeille':
                itemSelected.callAll('kill');
                arrayItemSelected = [];
                ingredientsOnThMap = arrayNameIngredients.slice();
                ingredients.callAll('kill');
                spawnElements(ingredients, arrayPositionIngredientOnTheMap, arrayNameIngredients);
                break;
        }
    }
}

function addItemInInventory(item)
{
    if(arrayItemSelected.length == 0){
        itemSelected.create(positionIngredientInventory1.x, positionIngredientInventory1.y, item);
        arrayItemSelected.push(item);
        deleteItemOnTheMap(item);
        console.log("La");
    }
    else if(arrayItemSelected.length == 1){
        itemSelected.create(positionIngredientInventory2.x, positionIngredientInventory2.y, item);
        arrayItemSelected.push(item);
        deleteItemOnTheMap(item);
        console.log("La");
    }else if(arrayItemSelected.length == 2){
        itemSelected.create(positionIngredientInventory3.x, positionIngredientInventory3.y, item);
        arrayItemSelected.push(item);
        deleteItemOnTheMap(item);
        console.log("La");
    }else{
        console.log("Inventory full");
    }
}

function animationMarmite(){
    marmite.animations.play('enter');
       setTimeout(() => {
            marmite.animations.stop();
            marmite.frame = 0;
       }, 1000)
}

function spawnElements(groupIngredients, arrayPositionIngredientOnTheMap, arrayNameIngredients){

    for(let i = 0; i < arrayPositionIngredientOnTheMap.length; i++)
    {
        groupIngredients.create(arrayPositionIngredientOnTheMap[i].x, arrayPositionIngredientOnTheMap[i].y, arrayNameIngredients[i]);
    }

}

function generateOtherPositionIngredient(groupIngredients){
    
    var limit = 8;
    var randomNumberPosition;
    var arrayPositionIngredientOnTheMapTmp = arrayPositionIngredientOnTheMap.slice();
    var arrayNameIngredientsTmp = ingredientsOnThMap.slice();

    groupIngredients.callAll('kill');

    for(i = 0;i <= 8; i++)
    {
        if(limit > 0){
            randomNumberPosition=Math.floor(Math.random()*(limit - 0+1));
            randomNumberIngredient = Math.floor(Math.random()*(limit - 0+1));
        }
        else{
            randomNumberPosition = 0;
            randomNumberIngredient = 0;
        }
        groupIngredients.create(arrayPositionIngredientOnTheMapTmp[randomNumberPosition].x, arrayPositionIngredientOnTheMapTmp[randomNumberPosition].y, arrayNameIngredientsTmp[randomNumberIngredient]);
        arrayPositionIngredientOnTheMapTmp[randomNumberPosition] = undefined;
        arrayNameIngredientsTmp[randomNumberIngredient] = undefined;

        arrayPositionIngredientOnTheMapTmp = arrayFilterElement(arrayPositionIngredientOnTheMapTmp);
        arrayNameIngredientsTmp = arrayFilterElement(arrayNameIngredientsTmp);
        limit--;
    }

}

function arrayFilterElement(array)
{
    array = array.filter(function(element){
        return element !== undefined;
    })

    return array;
}

function deleteItemOnTheMap(item)
{
    if(!inventoryIsFull())
    {
        console.log("[DEBUG]");
        for(let i = 0; i < ingredientsOnThMap.length; i++)
        {
            console.log("delete : " + item);
            if(ingredientsOnThMap[i] === item)
            {
                ingredientsOnThMap[i] = undefined;
                i = ingredientsOnThMap.length;
                console.log(item);
            }
        }
        ingredientsOnThMap = arrayFilterElement(ingredientsOnThMap);
    }
}

function generatePotions()
{
    var limit = 7;
    var potionsRandom = [];
    var allPotionsTmp = allPotions.slice();
    for(let i = 0; i < 3; i++)
    {
        randomNumberPotions=Math.floor(Math.random()*(limit - 0+1));
        allPotionsTmp = arrayFilterElement(allPotionsTmp);
        potionsRandom.push(allPotionsTmp[randomNumberPotions].name);
        allPotionsTmp[randomNumberPotions] = undefined;
        limit--;
    }
    return potionsRandom;
}



function inventoryIsFull()
{
    console.log("[DEBUG] taille : " + arrayItemSelected.length);
    if(arrayItemSelected.length > 3)
    {
        console.log("true");
        return true;
    }
    console.log("false");
    return false;
}

function deleteItemSelected(item)
{
    if(!inventoryIsFull())
    {
        deleteItemOnTheMap(item.key);
        item.kill();
    }
}
