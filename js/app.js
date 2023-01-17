let posibilities = [0,1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,18,19,20,21,22,23,24,27];

const width = 91.16;
const height = 91.2;
// Arreglo que contiene sprites
let blocks = [];
// Arreglo que contiene bloque e index 
let selectedBlock = [];

class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    } 

    preload(){ 
        this.load.image('bg', './assets/bg-menu.jpg'); 
        this.load.image('menu', './assets/menu.png');
        this.load.image('logo', './assets/23blockstitle.png');
        this.load.image('kid', './assets/nerd.png');
        this.load.image('background', './assets/background.jpg');
        this.load.spritesheet('23blocks', './assets/23blocks.png', { frameWidth: width, frameHeight: height});
    }
 
    create(){
        this.add.image(300, 200, 'background');


        /* Shuffle */
            this.shuffleArray(posibilities);
        /* */
        let positionX = 120;
        let positionY = 132;
        posibilities.forEach((element,index) => {
            if (index > 0 && index % 6 == 0){
                positionX = 120;
                positionY+= 92;
            }
            blocks.push(this.add.sprite(positionX, positionY, '23blocks', posibilities[index]));
            positionX += 92;
        });

        // x,y - Width, Height
        const blocks_zone = this.add.zone(0, 0, 800, 530);
        blocks_zone.setOrigin(0);
        blocks_zone.setInteractive();
        let downY, downX, upY, upX, threshold = 50;
        blocks_zone.on('pointerdown', (pointer) => {
            downX = pointer.x;
            downY = pointer.y;

            selectedBlock = this.getBlock(downX, downY);
        });

        blocks_zone.on('pointerup', (pointer) => {
            upX = pointer.x;
            upY = pointer.y;
            let blank;

            if (upX > (downX + 50)){
                console.log("Derecha");
                if (blank = this.canMove(upX, upY)){
                    this.move(selectedBlock, blank);
                }
            }else if (upX < (downX - 50)){
                console.log("Izquierda ");
                if (blank = this.canMove(upX, upY)){
                    this.move(selectedBlock, blank);
                }
            }else if (upY > (downY + 50)){
                console.log("Izquierda ");
                if (blank = this.canMove(upX, upY)){
                    this.move(selectedBlock, blank);
                }
            }else if (upY < (downY - 50)){
                console.log("Izquierda ");
                if (blank = this.canMove(upX, upY)){
                    this.move(selectedBlock, blank);
                }
            }
            this.doWin();
            // Separados toma el comportamiento de un Joystick
            // if (upY > (downY + 50)){
            //     console.log("Abajo");
            // }else if (upY < (downY - 50)){
            //     console.log("Arriba");
            // }
        });
        this.add.graphics().lineStyle(2, 0xffff).strokeRectShape(blocks);
    }

    /* Obtengo el blqoue pisado
    * @params double, double
    */
    getBlock(x, y){
        let response = null;
        blocks.forEach((elem, index) => {
            // Cuatro bordes del bloque
            let xL = (elem.x - (width/2));
            let xR = (elem.x + (width/2));
            let yUp = (elem.y + (height/2));
            let yDown = (elem.y - (height/2));

            if ((x > xL && x < xR) && y < yUp && y > yDown){
                // return elem;
                response = {
                    'elem': elem,
                    'index': index
                }
            }
        })
        return response;
    }

    /* Verifico si se moviío hacia el bloque vacío
    * @params double, double
    */
    canMove(x, y){
        let blanco = 0;
        let response = false;
        // Posicion del espacio
        posibilities.find((elem, index) => {
            if (elem == 27){
                blanco = index;
            }
        });

        // bloque vacío entre los sprites
        blocks.find((elem, index) => {
            if (index == blanco){
                // elem.setTexture('23blocks', 0);
                let xL = (elem.x - (width/2));
                let xR = (elem.x + (width/2));
                let yUp = (elem.y + (height/2));
                let yDown = (elem.y - (height/2));

                if ((x > xL && x < xR) && y < yUp && y > yDown){
                    response = {
                        'elem': elem,
                        'index': index
                    }
                }else {
                    response = false;
                }
            }
        })
        return response;
    }

    /* Realiza el movimiento visual y lógico
    * @params obj, ojb
    */
    move(selectedBlock, blank){
        let canMove = selectedBlock.index - blank.index;
        // Evito mivimientos diagonales (Sin ésta conf, funciona como rompecabezas)
        if (canMove == 1 || canMove == -1 || canMove == 6 || canMove == -6){
            let aux;
            // Visual
            selectedBlock.elem.setTexture('23blocks', 27);
            blank.elem.setTexture('23blocks', posibilities[selectedBlock.index]);
            // Reordenamiento
            aux = posibilities[selectedBlock.index];
            posibilities[selectedBlock.index] = posibilities[blank.index];
            posibilities[blank.index] = aux;
        }
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    doWin(){
        /*
        * Creo una copia de posibilities 
        * Tuve que copiar así el arreglo, porque si hago 
        * posibilitiesCopy = posibilities,
        * los cambios se reflejan en ambos
        * */
        let posibilitiesCopy = [];
        posibilities.forEach((elem,index) => {
            posibilitiesCopy[index] = elem;
        })
        
        let aux = 0;
        let changes = 0;
        for (let i = 0; i < posibilitiesCopy.length; i++){
            if (posibilitiesCopy[i] > posibilitiesCopy[i+1]){
                aux = posibilitiesCopy[i];
                posibilitiesCopy[i] = posibilitiesCopy[i+1];
                posibilitiesCopy[i+1] = aux;
                i = 0;
                changes++;
            }
        }
        console.log(changes);
        console.log(posibilitiesCopy);
        if (changes == 0){
            alert('Juego terminado');
        }
    }

    update(){

    }
}

// Configuracion general
const config = {
    // Phaser.AUTO, intenta usa WebGL y si el navegador no lo tiene, usa canva.
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 530,
    scene: [MainScene],
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            // gravity: { y: 350 }
        }
    }
}

// Inicializacion del objeto
game = new Phaser.Game(config)