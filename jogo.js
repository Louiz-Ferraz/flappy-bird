console.log('[DevSoutinho] Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

/* contexto.drawImage(  //Exemplo de como funciona drawImage
                        (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
    image,              //imagem a ser utilizada
    sx, sy,             //distância até a imagem que queremos que apareça na tela
    sWidth, sHeight,    //referente ao tamanho da imagem
    dx, dy,             //referente à posição dentro do canvas
    dWidth, dHeight     //tamanho da imagem dentro do canvas
); */

// Flappy Bird
const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 34,
    altura: 24,
    x: 10,
    y: 50,
    velocidade: 0,
    gravidade: 0.25,
    atualiza() {
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    desenha() {
        contexto.drawImage( //Essa função vai desenhar um chão que não ocupa toda a largura do canvas (320px)
            sprites,
            flappyBird.spriteX, flappyBird.spriteY,
            flappyBird.largura, flappyBird.altura,
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura,
        );
    }
}

// Chão
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    desenha() {
        contexto.drawImage( //Essa função vai desenhar um chão que não ocupa toda a largura do canvas (320px)
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            chao.x, chao.y,
            chao.largura, chao.altura,
        );
        contexto.drawImage( //Essa função vai desenhar a segunda parte do chão pra cobrir o que faltou
            sprites,
            chao.spriteX, chao.spriteY,
            chao.largura, chao.altura,
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
        );
    }
}

// Background
const planoFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 274,
    altura: 202,
    x: 0,
    y: canvas.height - 2*chao.altura,
    desenha() {
        contexto.fillStyle = '#70c5ce'; // Cor para pintar o fundo
        contexto.fillRect(0,0, canvas.width, canvas.height); // Dá as coordenadas no canvas para serem pintadas (de x=0,y=0 até x=largura do canvas,y=altura do canvas)
        contexto.drawImage( 
            sprites,
            planoFundo.spriteX, planoFundo.spriteY,
            planoFundo.largura, planoFundo.altura,
            planoFundo.x, planoFundo.y,
            planoFundo.largura, planoFundo.altura,
        );
        contexto.drawImage( 
            sprites,
            planoFundo.spriteX, planoFundo.spriteY,
            planoFundo.largura, planoFundo.altura,
            (planoFundo.x + planoFundo.largura), planoFundo.y,
            planoFundo.largura, planoFundo.altura,
        );
    }
}

function loop() {
    flappyBird.atualiza();

    planoFundo.desenha();
    chao.desenha();
    flappyBird.desenha();

    requestAnimationFrame(loop); //Função que ajuda a desenhar os quadros de forma inteligente
}

loop();