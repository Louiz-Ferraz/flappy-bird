console.log('Flappy Bird');

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

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

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chao.y) {
        return true;
    }

    return false;
}

function criaFlappyBird() {
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
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = -flappyBird.pulo
        },
        atualiza() {
            if (fazColisao(flappyBird, globais.chao)) {
                //console.log("Fez colisão");
                som_HIT.play();
                setTimeout(() => {
                    mudaParaTela(Telas.INICIO);
                }, 500);
                return;
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [ //Vetor
            { spriteX: 0, spriteY: 0, }, // asa pra cima
            { spriteX: 0, spriteY: 26, }, // asa no meio 
            { spriteX: 0, spriteY: 52, }, // asa pra baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio 
        ],
        frameAtual: 0,
        atualizaFrameAtual(){
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames; //Esse limite faz com que a atualização do sprite seja feita só a cada 10 frames

            if(passouOIntervalo == 0) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length; //utiliza o tamanho da qtd de movimentos para limitar as repetições
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha() {
            flappyBird.atualizaFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage( //Essa função vai desenhar um chão que não ocupa toda a largura do canvas (320px)
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;
}

// Chão
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoChao = 1;
            const repeteEm = chao.largura/2;
            const movimentacao = chao.x - movimentoChao;
            /*
            console.log('[chao.x]', chao.x);
            console.log('[repeteEm]', repeteEm);
            console.log('[movimentacao]', movimentacao % repeteEm)
            */
            chao.x = movimentacao % repeteEm;
        },
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
    return chao;
}

// Background
const planoFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 274,
    altura: 202,
    x: 0,
    y: canvas.height - 224,
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
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
    
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
        },
        desenha() {
            planoFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemInicio.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha() {
        planoFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza();
    }
};

function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop); //Função que ajuda a desenhar os quadros de forma inteligente
}

window.addEventListener("click", function() {
    if (telaAtiva.click) {
        telaAtiva.click();
    };
})

mudaParaTela(Telas.INICIO);
loop();