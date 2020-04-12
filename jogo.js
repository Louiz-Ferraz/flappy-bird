console.log('Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

/* contexto.drawImage(  //Exemplo de como funciona drawImage
                        (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)
    image,              //Imagem a ser utilizada
    sx, sy,             //Distância até a imagem que queremos que apareça na tela
    sWidth, sHeight,    //Referente ao tamanho da imagem
    dx, dy,             //Referente à posição dentro do canvas
    dWidth, dHeight     //Tamanho da imagem dentro do canvas
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

// Tela de início
const mensagemInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 151,
    x: (canvas.width/2) - 174/2,
    y: 50,
    desenha() {
        contexto.drawImage( 
            sprites,
            mensagemInicio.spriteX, mensagemInicio.spriteY,
            mensagemInicio.largura, mensagemInicio.altura,
            mensagemInicio.x, mensagemInicio.y,
            mensagemInicio.largura, mensagemInicio.altura,
        );
    }
}

//
// Telas
//

let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
}

const Telas = {
    INICIO: {
        desenha() {
            planoFundo.desenha();
            chao.desenha();
            flappyBird.desenha();
            mensagemInicio.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
        }
    }
};

Telas.JOGO = {
    desenha() {
        planoFundo.desenha();
        chao.desenha();
        flappyBird.desenha();
    },
    atualiza() {
        flappyBird.atualiza();
    }
};

function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    requestAnimationFrame(loop); //Função que ajuda a desenhar os quadros de forma inteligente
}

window.addEventListener("click", function() {
    if (telaAtiva.click) {
        telaAtiva.click();
    };
})

mudaParaTela(Telas.INICIO);
loop();