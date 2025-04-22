// script.js

document.addEventListener('DOMContentLoaded', function () {
    
    const gameContainer = document.getElementById('game-container');

    function setGameContainerMaxHeight() {
        const windowHeight = window.innerHeight;
        // Set max-height on the container based on actual window height
        gameContainer.style.maxHeight = `${windowHeight}px`;
        // console.log(`Set game-container max-height to ${windowHeight}px`); // Optional debug
    }

    setGameContainerMaxHeight();
    window.addEventListener('resize', setGameContainerMaxHeight);

    const config = {
        type: Phaser.CANVAS,
        width: 600,
        height: 900,
        parent: 'game-container',
        backgroundColor: '#242424',
        scene: { preload, create, update },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY }
    };

    const game = new Phaser.Game(config);

    if (game && game.scale) {
        game.scale.refresh();
    }

    // Globals
    const playerList = [
        { name: "Curry", accuracy: "perfect", image: "curry.webp" },
        { name: "Bird", accuracy: "perfect", image: "bird.webp" },
        { name: "Dame", accuracy: "perfect", image: "dame.webp" },
        { name: "Harden", accuracy: "high", image: "harden.webp" },
        { name: "Doncic", accuracy: "high", image: "doncic.webp" },
        { name: "Tatum", accuracy: "high", image: "tatum.webp" },
        { name: "Shai", accuracy: "high", image: "shai.webp" },
        { name: "Brown", accuracy: "high", image: "brown.webp" },
        { name: "James", accuracy: "high", image: "james-lebron.webp" },
        { name: "Dlo", accuracy: "medium", image: "dlo.webp" },
        { name: "Poole", accuracy: "medium", image: "poole.webp" },
        { name: "Bane", accuracy: "medium", image: "bane.webp" },
        { name: "Knecht", accuracy: "medium", image: "knecht.webp" },
        { name: "Bryant", accuracy: "medium", image: "bryant-kobe.webp" },
        { name: "Jokic", accuracy: "medium", image: "jokic.webp" },
        { name: "Thompson", accuracy: "low", image: "thompson.webp" },
        { name: "Oubre Jr", accuracy: "low", image: "oubre-jr.webp" },
        { name: "Barnes", accuracy: "low", image: "barnes-scottie.webp" },
        { name: "Giannis", accuracy: "low", image: "giannis.webp" },
        { name: "Adebayo", accuracy: "low", image: "adebayo.webp" },
        { name: "Davis", accuracy: "low", image: "davis-anthony.webp" },
        { name: "Draymond", accuracy: "low", image: "green-draymond.webp" },
        { name: "Randle", accuracy: "low", image: "randle.webp" },
        { name: "Zubac", accuracy: "low", image: "zubac.webp" },
        { name: "Kuminga", accuracy: "low", image: "kuminga.webp" },
        { name: "Wemby", accuracy: "low", image: "wemby.webp" },
        { name: "Coulibaly", accuracy: "low", image: "coulibaly.webp" },
        { name: "Banchero", accuracy: "low", image: "banchero.webp" },
        { name: "Green Jalen", accuracy: "low", image: "green-jalen.webp" },
        { name: "Westbrook", accuracy: "extremely low", image: "westbrook.webp" },
        { name: "Castle", accuracy: "extremely low", image: "castle.webp" },
        { name: "Oneal", accuracy: "extremely low", image: "oneal.webp" }
    ];
    let currentPlayer;
    let score = 0;
    let timer = 60;
    let timerText, scoreText, streakText;
    let backboard, ball, playerSprite;
    let shotMeterBar, shotMeterPointer;
    let shotMeterDirection = 1;
    let baseMeterSpeed;
    let accuracyZonePerfect, accuracyZoneGood;
    let messageText, pointsText;
    let isClutchMode = false;
    let canStartClutch = true;
    let justExitedClutch = false;
    let clutchTimerEvent;
    let clutchTime = 7;
    let madeShotsInRow = 0;
    let gameEnded = false;
    let infoBarGraphics;
    let started = false;
    let skipIntro = false;
    let overlayGroup = [];
    let shotResultMessage = '';

     // Добавьте ссылки на элементы лоадера в Globals (или получите их в preload/create)
     let loaderElement;
     let loaderBar;
     let loaderPercentText;
 
     function preload() {
        console.log('*** Phaser preload() running ***');
    
        // Получаем элементы лоадера из DOM
        loaderElement = document.getElementById('loader');
        loaderBar = document.getElementById('loader-bar');
        loaderPercentText = document.getElementById('loader-percent'); // Этот элемент HTML
    
        const gameCanvas = document.querySelector('#game-container canvas'); // Получаем канвас
    
        // Скрываем канвас в начале preload (если CSS не сработал или на всякий случай)
         if (gameCanvas) {
            gameCanvas.style.visibility = 'hidden';
         }
         // Показываем лоадер
         if (loaderElement) {
            // Используем flex, как в CSS, чтобы лоадер был видим
            loaderElement.style.display = 'flex';
         }
    
    
        // Добавляем обработчики событий загрузки Phaser
        this.load.on('progress', function (value) {
            // value - это число от 0 до 1
            const percent = Math.round(value * 100) + '%';
    
            if (loaderBar) {
                loaderBar.style.width = percent;
            }
            if (loaderPercentText) {
                // ИСПОЛЬЗУЕМ textContent для HTML-элемента
                loaderPercentText.textContent = percent; // <-- ИСПРАВЛЕНО ЗДЕСЬ
            }
        });
    
        this.load.on('complete', function () {
            console.log('*** Phaser preload() complete ***');
            // Загрузка завершена, скрываем лоадер и показываем канвас
             if (loaderElement) {
                loaderElement.style.display = 'none'; // Скрываем лоадер
             }
             if (gameCanvas) {
                gameCanvas.style.visibility = 'visible'; // Показываем канвас
             }
        });
    
    
        // --- ВАШИ ЗАГРУЖАЕМЫЕ АССЕТЫ ---
        this.load.image('backboard', 'images/backboard.png');
        this.load.image('arrow', 'images/arrow.png');
        this.load.image('playerSilhouette1', 'images/playerSilhouette1.png');
        playerList.forEach(p => {
            const key = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            this.load.image(key, `images/players/${p.image}`);
        });
        // --- КОНЕЦ ВАШИХ ЗАГРУЖАЕМЫХ АССЕТОВ ---
    } 

    function create() {
        console.log('*** Phaser create() running ***');
        console.log('Canvas element:', this.game.canvas);
        console.log('Canvas resolution:', this.game.canvas.width, '×', this.game.canvas.height);
        if (loaderElement) {
            loaderElement.style.display = 'none';
         }
         const gameCanvas = document.querySelector('#game-container canvas');
         if (gameCanvas) {
            gameCanvas.style.visibility = 'visible';
         }

        // UI Bar and info
        this.add.rectangle(0, 0, config.width, config.height, 0x242424).setOrigin(0); // Actual game background - should draw over the first debug red rect
        infoBarGraphics = this.add.graphics().fillStyle(0x333333,1).fillRect(0,0,config.width,80).setDepth(1); // Added depth
        const barStyle = { fontSize:'32px',fill:'#eee',fontFamily:'"Special Gothic Expanded One",monospace',align:'center' };
        scoreText = this.add.text(config.width*0.1,20,'0',barStyle).setOrigin(0.5).setDepth(1); // Added depth
        this.add.text(config.width*0.1,50,'Score',{fontSize:'16px',fill:'#eee',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(1); // Added depth
        timerText = this.add.text(config.width/2,20,':60',barStyle).setOrigin(0.5).setDepth(1); // Added depth
        this.add.text(config.width/2,50,'Time',{fontSize:'16px',fill:'#eee',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(1); // Added depth
        streakText=this.add.text(config.width*0.9,20,'x0',barStyle).setOrigin(0.5).setDepth(1); // Added depth
        this.add.text(config.width*0.9,50,'Streak',{fontSize:'16px',fill:'#eee',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(1); // Added depth
        updateInfoBar.call(this);

        // Court graphics
        backboard = this.add.image(config.width/2,200,'backboard').setScale(0.6).setDepth(0.5); // Added depth
        ball = this.add.circle(config.width/2,700,45,0xffa500).setVisible(false).setDepth(0.6); // Added depth
        playerSprite = this.add.sprite(config.width/2,920,'playerSilhouette1').setScale(0.9).setDepth(0.7); // Added depth

        // Points & messages
        pointsText = this.add.text(config.width/2,config.height/2-80,'',{fontSize:'48px',fill:'#fff',fontFamily:'"Special Gothic Expanded One",monospace',align:'center',wordWrap:{width:config.width-40}}).setOrigin(0.5).setDepth(2000).setAlpha(0);
        messageText= this.add.text(config.width/2,config.height/2-20,'',{fontSize:'36px',fill:'#fff',fontFamily:'"Special Gothic Expanded One",monospace',align:'center',wordWrap:{width:config.width-40}}).setOrigin(0.5).setDepth(2000).setAlpha(0);

        // Shot meter
        const meterY=config.height-150;
        shotMeterBar = this.add.rectangle(config.width/2,meterY,365,32,0xFFFFFF).setOrigin(0.5).setStrokeStyle(2,0x000000).setDepth(1); // Added depth
        shotMeterBar.meterWidth=365;
        shotMeterPointer=this.add.sprite(config.width/2,meterY-14,'arrow').setOrigin(0.5,1).setDepth(1.1); // Added depth

        // Countdown
        this.time.addEvent({delay:1000,callback:countdown,callbackScope:this,loop:true});

        // Intro overlay - UNCOMMENT THIS BLOCK
        if (!skipIntro) {
            const bg=this.add.rectangle(0,0,config.width,config.height,0x000000,0.85).setOrigin(0).setDepth(10000); // Increased depth
            overlayGroup=[bg];
            const title=this.add.text(config.width/2,150,'Perfect Shot',{fontSize:'64px',fill:'#ffffff',fontFamily:'"Special Gothic Expanded One",monospace',align:'center'}).setOrigin(0.5).setDepth(10001);
            const rules=[
                '• Tap or press SPACE when the arrow is in the green zone.',
                '• Green=perfect, light green=good, red=miss.', // ADDED COMMA HERE
                '• Score as many points as you can in 60 seconds!'
            ];
            const rulesText=this.add.text(config.width/2,300,rules.join('\n'),{fontSize:'24px',fill:'#ffffff',fontFamily:'"Special Gothic Expanded One",monospace',align:'center',wordWrap:{width:500}}).setOrigin(0.5).setDepth(10001);
            const btn=this.add.graphics({fillStyle:{color:0xF44336}}).setDepth(10001);
            btn.fillRoundedRect(config.width/2-152.5,500,305,75,10).setInteractive(new Phaser.Geom.Rectangle(config.width/2-152.5,500,305,75),Phaser.Geom.Rectangle.Contains).on('pointerdown',()=>{started=true;overlayGroup.forEach(o=>o.destroy());overlayGroup=[];});
            const startLabel=this.add.text(config.width/2,540,'START',{fontSize:'45px',fill:'#ffffff',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(10001);
            overlayGroup.push(title,rulesText,btn,startLabel);
        } else { // UNCOMMENT THIS LINE
            started=true; // UNCOMMENT THIS LINE
            // Ensure overlay elements don't exist if skipping intro
            overlayGroup.forEach(o => o.destroy());
            overlayGroup = [];
        } // UNCOMMENT THIS LINE


        // Controls
        this.input.keyboard.on('keydown-SPACE',shoot,this);
        const shootBtn=this.add.graphics({fillStyle:{color:0xF44336}}).setDepth(1);
        // Изначально: fillRoundedRect(config.width/2-152.5,config.height-150,305,75,10)
        // Новое: fillRoundedRect(config.width/2-152.5,config.height-100,305,75,10) // <-- Сдвинуто на 50px ниже
        shootBtn.fillRoundedRect(config.width/2-152.5,config.height-100,305,75,10).setInteractive(new Phaser.Geom.Rectangle(config.width/2-152.5,config.height-100,305,75),Phaser.Geom.Rectangle.Contains).on('pointerdown',shoot,this);
        // Изначально: this.add.text(config.width/2,config.height-113,'SHOOT', ... )
        // Новое: this.add.text(config.width/2,config.height-63,'SHOOT', ... ) // <-- Сдвинуто на 50px ниже (113 - 50 = 63)
        this.add.text(config.width/2,config.height-63,'SHOOT',{fontSize:'45px',fill:'#ffffff',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(1.1);

        restartGame=()=>{skipIntro=true;this.scene.restart();};
        startNewRound.call(this); // This sets up the first player/zones even before 'started' is true
    }

    function update(){
        if(!started||gameEnded)return;
        const speed=baseMeterSpeed*(isClutchMode?2.8:1.8);
        shotMeterPointer.x+=shotMeterDirection*speed;
        const half=shotMeterBar.meterWidth/2;
        if(shotMeterPointer.x>=shotMeterBar.x+half||shotMeterPointer.x<=shotMeterBar.x-half)shotMeterDirection*=-1;
        shotMeterPointer.x=Phaser.Math.Clamp(shotMeterPointer.x,shotMeterBar.x-half,shotMeterBar.x+half);
        shotMeterPointer.y=shotMeterBar.y-14;
    }

    function startNewRound(){
        ball.setVisible(false);
        if(!playerList.length)return;
        currentPlayer=Phaser.Utils.Array.GetRandom(playerList);
        baseMeterSpeed=Phaser.Math.FloatBetween(2.7,3.3)*1.25;
        const key=currentPlayer.name.toLowerCase().replace(/[^a-z0-9]/g,'');
        playerSprite.setTexture(this.textures.exists(key)?key:'playerSilhouette1');
        updateAccuracyZones.call(this,currentPlayer);
        if(!isClutchMode&&canStartClutch&&!justExitedClutch&&Phaser.Math.Between(1,100)<=15)startClutchMode.call(this);
        justExitedClutch=false;
    }

    function updateAccuracyZones(player) {
        // Уничтожаем старые зоны, если они существуют
        if (accuracyZonePerfect) accuracyZonePerfect.destroy();
        if (accuracyZoneGood)    accuracyZoneGood.destroy();
    
        let perfectW = 20, goodW = 60;
        switch (player.accuracy) {
            case 'perfect':       perfectW = 40; goodW = 120; break;
            case 'high':          perfectW = 30; goodW = 100; break;
            case 'medium':        perfectW = 20; goodW = 60;  break;
            case 'low':           perfectW = 15; goodW = 45;  break;
            case 'extremely low': perfectW = 5;  goodW = 20;  break;
        }
        const y = config.height - 150; // Позиция Y такая же, как у шкалы броска
        // Добавляем .setDepth(1.2)
        accuracyZonePerfect = this.add.rectangle(config.width/2, y, perfectW, 32, 0x006D00)
            .setOrigin(0.5)
            .setAlpha(1)
            .setDepth(1.2); // <-- Добавлено
    
        // Добавляем .setDepth(1.2)
        accuracyZoneGood = this.add.rectangle(config.width/2, y, goodW, 32, 0x006D00)
            .setOrigin(0.5)
            .setAlpha(0.4)
            .setDepth(1.2); // <-- Добавлено
    }

    function shoot() {
        if (gameEnded || ball.visible || !started) return;
    
        this.tweens.add({ targets: playerSprite, y: 880, duration: 100, ease: 'Power2', yoyo: true });
    
        ball.x = playerSprite.x;
        ball.y = playerSprite.y;
        ball.setVisible(true);
    
        // applyMeterOnTop.call(this); // Эту строку убрали, как обсуждали
    
        const accuracy = getAccuracy.call(this);
        const miss = accuracy === 'miss';
    
        let msg;
        if (isClutchMode && miss) msg = 'CLUTCH RUINED';
        else if (isClutchMode && accuracy === 'perfect') msg = 'CLUTCH SAVED';
        else if (!isClutchMode && miss) msg = Phaser.Math.RND.pick(['BRICKED!', 'HUH?', 'TOO BRIGHT', 'LMAO']);
        else if (accuracy === 'perfect') msg = 'PERFECT';
        else if (accuracy === 'lucky') msg = 'LUCKY ONE!';
        else msg = 'GOOD';
        shotResultMessage = msg;
    
        let targetX, targetY, duration;
        const baseDuration = 400; // Базовая длительность полета
        const hoopCenterX = config.width / 2;
        const hoopCenterY = backboard.y - 30; // Центр кольца примерно здесь
    
        if (!miss) {
            // УСПЕШНЫЙ БРОСОК (Perfect, Lucky, Good) - летит в кольцо
            targetX = hoopCenterX + (shotMeterPointer.x - config.width / 2) * 0.05; // Небольшое горизонтальное отклонение от точности при броске
            targetY = hoopCenterY;
            duration = baseDuration;
            // Добавляем небольшой "изгиб" к траектории для лучшего вида
            // Phaser's standard tweens are linear in each axis. For a curved path,
            // we could use Path objects or separate tweens/physics.
            // For now, let's keep it simple with slightly adjusted targetX/Y.
            // The current linear tween looks okay for a quick shot.
        } else {
            // ПРОМАХ - Рандомная траектория
            const missType = Phaser.Math.RND.integerInRange(1, 4); // 1: Короткий, 2: Длинный, 3: В сторону, 4: В щит
            duration = baseDuration + Phaser.Math.RND.integerInRange(-50, 100); // Немного варьируем длительность
    
            switch (missType) {
                case 1: // Короткий / В передний край
                    targetX = hoopCenterX + Phaser.Math.RND.integerInRange(-30, 30);
                    targetY = hoopCenterY + Phaser.Math.RND.integerInRange(40, 80); // Не долетает, ниже кольца
                    break;
                case 2: // Длинный / Перелет
                    targetX = hoopCenterX + Phaser.Math.RND.integerInRange(-50, 50);
                    targetY = hoopCenterY - Phaser.Math.RND.integerInRange(50, 100); // Перелетает, выше щита
                    break;
                case 3: // В сторону (мимо кольца)
                    const side = Phaser.Math.RND.pick([-1, 1]); // -1 для левой стороны, 1 для правой
                    targetX = hoopCenterX + side * Phaser.Math.RND.integerInRange(70, 150); // Значительное смещение влево/вправо
                    targetY = hoopCenterY + Phaser.Math.RND.integerInRange(-20, 20); // Примерно на высоте кольца
                    break;
                case 4: // В щит (где-то в стороне)
                    targetX = hoopCenterX + Phaser.Math.RND.integerInRange(-100, 100); // В любой точке по ширине щита
                    targetY = backboard.y + Phaser.Math.RND.integerInRange(-50, 50); // В любой точке по высоте щита
                     // Убедимся, что не попали случайно в кольцо
                    if (Math.abs(targetX - hoopCenterX) < 50 && Math.abs(targetY - hoopCenterY) < 50) {
                         // Если слишком близко к кольцу, сдвинем немного
                         targetX += (targetX > hoopCenterX ? 1 : -1) * 60;
                    }
                    break;
            }
             // Для промахов можно добавить легкую вариацию начальной X позиции,
             // чтобы бросок не всегда выходил строго из центра игрока.
             // Например: ball.x += Phaser.Math.RND.integerInRange(-5, 5);
        }
    
    
        // Start the ball animation tween
        this.tweens.add({
            targets: ball,
            x: targetX, // Используем вычисленные targetX
            y: targetY, // Используем вычисленные targetY
            duration: duration,
            ease: 'Linear', // Для разных промахов можно использовать Linear или Power1/2,
                             // экспериментируйте для лучшего ощущения
            onComplete: () => {
                // Анимация полета завершена
                ball.setVisible(false);
    
                // Обновляем счет и показываем сообщение/очки
                showPointsAndMessage.call(this, accuracy);
    
                // Обновляем стрик
                if (!miss) {
                    madeShotsInRow++;
                } else {
                    madeShotsInRow = 0; // Промах сбрасывает стрик
                }
                updateInfoBar.call(this); // Обновляем отображение стрика
    
                // Обрабатываем конец режима Clutch
                if (isClutchMode) {
                   endClutchMode.call(this); // Завершаем режим Clutch
                   // После завершения Clutch, независимо от результата броска в Clutch,
                   // начинаем новый раунд с новым игроком.
                   startNewRound.call(this);
                } else if (!miss) {
                    // Вне режима Clutch, новый раунд с новым игроком начинаем только при успешном попадании.
                    startNewRound.call(this);
                }
                // При промахе вне режима Clutch, startNewRound не вызывается,
                // игрок остается тем же, и игрок может бросить снова.
            }
        });
    }

// 3) Синхрон + быстрое исчезновение через 200 мс
function showPointsAndMessage(accuracy) {
    // сразу убиваем любые висящие твины
    this.tweens.killTweensOf(pointsText);
    this.tweens.killTweensOf(messageText);

    // вычисляем pts и цвет
    let pts, color;
    if (isClutchMode) {
        if (accuracy === 'perfect') pts = +20,   color = '#00FF00';
        else if (accuracy === 'miss')  pts = -20, color = '#FF0000';
        else                           pts = +3,  color = '#CCFFCC';
    } else {
        if (accuracy === 'perfect')     pts = +6,  color = '#00FF00';
        else if (accuracy === 'lucky')  pts = +3,  color = '#CCFFCC';
        else if (accuracy === 'good')   pts = +3,  color = '#CCFFCC';
        else                            pts = -1,  color = '#FF0000';
    }
    score += pts;
    updateInfoBar.call(this);

    // показываем оба сразу
    pointsText.setText((pts > 0 ? '+' : '') + pts)
              .setFill(color)
              .setAlpha(1);
    messageText.setText(shotResultMessage)
               .setFill(color)
               .setAlpha(1);

    // и через 200ms оба исчезают за 200ms
    this.tweens.add({
        targets: [pointsText, messageText],
        alpha: 0,
        duration: 200,
        delay: 200
    });
}

    function getAccuracy(){const x=shotMeterPointer.x,pz=accuracyZonePerfect,gz=accuracyZoneGood;if(x>pz.x-pz.width/2&&x<pz.x+pz.width/2)return'perfect';if(x>gz.x-gz.width/2&&x<gz.x+gz.width/2)return Phaser.Math.Between(1,100)<=20?'lucky':'good';return'miss';}
    function countdown(){if(gameEnded||!started)return;timer--;updateInfoBar.call(this);if(timer<=0)endGame.call(this);}
    function startClutchMode(){isClutchMode=true;canStartClutch=false;justExitedClutch=false;infoBarGraphics.clear().fillStyle(0xFF0000,1).fillRect(0,0,config.width,80);clutchTime=7;if(clutchTimerEvent)clutchTimerEvent.remove();clutchTimerEvent=this.time.addEvent({delay:1000,callback:updateClutchTime,callbackScope:this,loop:true});}
    function updateClutchTime(){clutchTime--;timerText.setText(clutchTime);if(clutchTime<=0)endClutchMode.call(this);}
    function endClutchMode(){isClutchMode=false;canStartClutch=true;justExitedClutch=true;if(clutchTimerEvent){clutchTimerEvent.remove();clutchTimerEvent=null;}infoBarGraphics.clear().fillStyle(0x333333,1).fillRect(0,0,config.width,80);timerText.alpha=1;}
    function applyMeterOnTop(){shotMeterBar.y=config.height-200;shotMeterPointer.y=shotMeterBar.y-14;accuracyZonePerfect.y=shotMeterBar.y;accuracyZoneGood.y=shotMeterBar.y;}
    function endGame(){this.add.rectangle(0,0,config.width,config.height,0x000000,0.85).setOrigin(0).setDepth(10000);gameEnded=true;updateInfoBar.call(this);messageText.setText(getEndGameMessage()).setFill('#fff').setAlpha(1).setWordWrapWidth(config.width-40);const y=config.height/2+100;this.add.text(config.width/2,y,'Restart',{fontSize:'32px',fill:'#fff',backgroundColor:'#007bff',padding:{x:20,y:10},fontFamily:'"Special Gothic Expanded One",monospace',align:'center'}).setOrigin(0.5).setDepth(10001).setInteractive().on('pointerdown',()=>{skipIntro=true;this.scene.restart();});this.add.text(config.width/2,y+60,'Share Score',{fontSize:'32px',fill:'#fff',backgroundColor:'#28a745',padding:{x:20,y:10},fontFamily:'"Special Gothic Expanded One",monospace',align:'center'}).setOrigin(0.5).setDepth(10001).setInteractive().on('pointerdown',()=>alert(`I scored ${score} points!`));}
    function getEndGameMessage(){if(score<10)return'Stick to layups.';if(score<20)return'Bench warmer energy.';if(score<40)return'Cooking out here!';return'Unstoppable mode activated!';}
    function updateInfoBar(){const t=timer<10?`:0${timer}`:`:${timer}`;timerText.setText(started?(isClutchMode?`${clutchTime}`:t):t);scoreText.setText(score);streakText.setText(`x${madeShotsInRow||0}`);}
});
