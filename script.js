// script.js

document.addEventListener('DOMContentLoaded', function () {

    const gameContainer = document.getElementById('game-container');

    function setGameContainerMaxHeight() {
        const windowHeight = window.innerHeight;
        gameContainer.style.maxHeight = `${windowHeight}px`;
    }

    setGameContainerMaxHeight();
    window.addEventListener('resize', setGameContainerMaxHeight);

    const config = {
        type: Phaser.CANVAS,
        width: 600,
        height: 1000, // Internal game height
        parent: 'game-container',
        backgroundColor: '#242424',
        scene: { preload, create, update },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY // Align to top vertically, center horizontally
        }
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
    const meterBarWidth = 365;
    const meterBarHeight = 32;
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

    const playerBaseDistanceFromBottom = 330;
    const playerJumpHeight = 5;

    let loaderElement;
    let loaderBar;
    let loaderPercentText;


    function preload() {
        loaderElement = document.getElementById('loader');
        loaderBar = document.getElementById('loader-bar');
        loaderPercentText = document.getElementById('loader-percent');

        const gameCanvas = document.querySelector('#game-container canvas');

        if (gameCanvas) {
           gameCanvas.style.visibility = 'hidden';
        }
        if (loaderElement) {
           loaderElement.style.display = 'flex';
        }

        this.load.on('progress', function (value) {
            const percent = Math.round(value * 100) + '%';
            if (loaderBar) loaderBar.style.width = percent;
            if (loaderPercentText) loaderPercentText.textContent = percent;
        });

        this.load.on('complete', function () {
             if (loaderElement) {
                loaderElement.style.display = 'none';
             }
             if (gameCanvas) {
                gameCanvas.style.visibility = 'visible';
             }
        });

        this.load.image('backboard', 'images/backboard.png');
        this.load.image('arrow', 'images/arrow.png');
        this.load.image('playerSilhouette1', 'images/playerSilhouette1.png');
        playerList.forEach(p => {
            const key = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            this.load.image(key, `images/players/${p.image}`);
        });
    }

    function create() {
        if (loaderElement) {
           loaderElement.style.display = 'none';
        }
        const gameCanvas = document.querySelector('#game-container canvas');
        if (gameCanvas) {
           gameCanvas.style.visibility = 'visible';
        }

        this.add.rectangle(0, 0, config.width, config.height, 0x242424).setOrigin(0).setDepth(0);

        infoBarGraphics = this.add.graphics().fillStyle(0x333333,1).fillRect(0,0,config.width,80).setDepth(1);
        const barStyle = { fontSize:'32px',fill:'#eee',fontFamily:'"Special Gothic Expanded One",monospace',align:'center' };
        scoreText = this.add.text(config.width*0.1,20,'0',barStyle).setOrigin(0.5).setDepth(1.1);
        this.add.text(config.width*0.1,50,'Score',{fontSize:'16px',fill:'#eee',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(1.1);
        timerText = this.add.text(config.width/2,20,':60',barStyle).setOrigin(0.5).setDepth(1.1);
        this.add.text(config.width/2,50,'Time',{fontSize:'16px',fill:'#eee',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(1.1);
        streakText=this.add.text(config.width*0.9,20,'x0',barStyle).setOrigin(0.5).setDepth(1.1);
        this.add.text(config.width*0.9,50,'Streak',{fontSize:'16px',fill:'#eee',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(1.1);
        updateInfoBar.call(this);

        backboard = this.add.image(config.width/2,200,'backboard').setScale(0.5).setDepth(0.5);
        ball = this.add.circle(config.width/2,700,35,0xffa500).setVisible(false).setDepth(0.6);

        const playerBaseY = config.height - playerBaseDistanceFromBottom;
        playerSprite = this.add.sprite(config.width/2, playerBaseY,'playerSilhouette1').setScale(0.4).setDepth(0.7);

        pointsText = this.add.text(config.width/2,config.height/2-80,'',{fontSize:'48px',fill:'#fff',fontFamily:'"Special Gothic Expanded One",monospace',align:'center',wordWrap:{width:config.width-40}}).setOrigin(0.5).setDepth(2000).setAlpha(0);
        messageText= this.add.text(config.width/2,config.height/2-20,'',{fontSize:'36px',fill:'#fff',fontFamily:'"Special Gothic Expanded One",monospace',align:'center',wordWrap:{width:config.width-40}}).setOrigin(0.5).setDepth(2000).setAlpha(0);

        const meterY=config.height-150;
        shotMeterBar = this.add.rectangle(config.width/2, meterY, meterBarWidth, meterBarHeight, 0xFFFFFF).setOrigin(0.5).setStrokeStyle(2,0x000000).setDepth(1.1);
        shotMeterBar.meterWidth = meterBarWidth;
        shotMeterPointer=this.add.sprite(config.width/2, meterY - meterBarHeight/2 - 2,'arrow').setOrigin(0.5,1).setDepth(1.2);

        this.time.addEvent({delay:1000,callback:countdown,callbackScope:this,loop:true});

        this.input.keyboard.on('keydown-ENTER', () => {
            started = true;
            overlayGroup.forEach(o => o.destroy());
            overlayGroup = [];
        });

        if (!skipIntro) {
            const bg=this.add.rectangle(0,0,config.width,config.height,0x000000,0.85).setOrigin(0).setDepth(10000);
            overlayGroup=[bg];
            const title=this.add.text(config.width/2,150,'Perfect Shot',{fontSize:'64px',fill:'#ffffff',fontFamily:'"Special Gothic Expanded One",monospace',align:'center'}).setOrigin(0.5).setDepth(10001);
            const rules=[
                '• Tap or press SPACE when the arrow is in the green zone.',
                '• Green=perfect, light green=good, red=miss.',
                '• Score as many points as you can in 60 seconds!'
            ];
            const rulesText=this.add.text(config.width/2,300,rules.join('\n'),{fontSize:'24px',fill:'#ffffff',fontFamily:'"Special Gothic Expanded One",monospace',align:'center',wordWrap:{width:500}}).setOrigin(0.5).setDepth(10001);
            const btn=this.add.graphics({fillStyle:{color:0xF44336}}).setDepth(10001);
            btn.fillRoundedRect(config.width/2-152.5,500,305,75,10).setInteractive(new Phaser.Geom.Rectangle(config.width/2-152.5,500,305,75),Phaser.Geom.Rectangle.Contains).on('pointerdown',()=>{started=true;overlayGroup.forEach(o=>o.destroy());overlayGroup=[];});
            const startLabel=this.add.text(config.width/2,540,'START',{fontSize:'45px',fill:'#ffffff',fontFamily:'"Special Gothic Expanded One",monospace'}).setOrigin(0.5).setDepth(10001);
            overlayGroup.push(title,rulesText,btn,startLabel);
        } else {
            started = true;
            overlayGroup.forEach(o => o.destroy());
            overlayGroup = [];
        }

        // Controls (Кнопка SHOOT)
        const shootButtonWidth = meterBarWidth;
        const shootButtonHeight = 75;
        const buttonMeterGap = 20;

        // >>> НОВАЯ ЛОГИКА ПОЗИЦИОНИРОВАНИЯ: РАССЧИТЫВАЕМ ЦЕНТР КНОПКИ <<<
        // Y-координата ЦЕНТРА кнопки: низ шкалы + отступ + половина высоты кнопки
        const shootButtonCenterX = config.width / 2;
        const shootButtonCenterY = meterY + meterBarHeight / 2 + buttonMeterGap + shootButtonHeight / 2;

        // Отступ для интерактивной области (с каждой стороны)
        const interactiveAreaPadding = 15;
        // Рассчитываем увеличенную ширину и высоту интерактивной области
        const interactiveAreaWidth = shootButtonWidth + interactiveAreaPadding * 2;
        const interactiveAreaHeight = shootButtonHeight + interactiveAreaPadding * 2;


        // Создаем ГРАФИКУ кнопки. Позиционируем ГРАФИЧЕСКИЙ ОБЪЕКТ по центру кнопки.
        const shootBtnGraphic = this.add.graphics({ fillStyle: { color: 0xF44336 } }).setDepth(1.3);
        shootBtnGraphic.setPosition(shootButtonCenterX, shootButtonCenterY); // Устанавливаем позицию ОБЪЕКТА по центру кнопки
        // Рисуем прямоугольник относительно ПОЗИЦИИ ОБЪЕКТА (которая сейчас центр кнопки)
        // Поэтому прямоугольник нужно рисовать с центром в (0,0) относительно shootBtnGraphic.x/y
        shootBtnGraphic.fillRoundedRect(-shootButtonWidth / 2, -shootButtonHeight / 2, shootButtonWidth, shootButtonHeight, 10);


        // Создаем ТЕКСТОВЫЙ объект кнопки. Позиционируем его по центру кнопки.
        const shootText = this.add.text(shootButtonCenterX, shootButtonCenterY, 'SHOOT', {
            fontSize: '45px',
            fill: '#ffffff',
            fontFamily: '"Special Gothic Expanded One",monospace',
            align: 'center'
        }).setOrigin(0.5).setDepth(1.4); // Origin(0.5) уже центрирует текст относительно его X/Y


        // Создаем НЕВИДИМЫЙ ПРЯМОУГОЛЬНИК ДЛЯ ИНТЕРАКТИВНОСТИ. Позиционируем его по центру кнопки.
        const shootBtnInteractiveArea = this.add.rectangle(
            shootButtonCenterX, // Используем рассчитанный центр X
            shootButtonCenterY, // Используем рассчитанный центр Y
            interactiveAreaWidth,   // Используем увеличенную ширину
            interactiveAreaHeight,  // Используем увеличенную высоту
            0xffffff,
            0
        )
        .setOrigin(0.5) // >>> Устанавливаем Origin (0.5) <<< чтобы он соответствовал координатам Центра X/Y
        .setDepth(1.5) // Глубина выше графики и текста кнопки
        .setInteractive()
        .on('pointerdown', function() {
            shoot.call(this); // 'this' внутри обработчика - это сцена
        }, this); // Передаем контекст сцены ('this')

        // >>> КОНЕЦ СКОРРЕКТИРОВАННОЙ ЛОГИКИ <<<

        // Теперь переменные shootBtnGraphic, shootText, shootBtnInteractiveArea доступны
        // Если вы хотите добавить эффект нажатия позже, используйте эти переменные.
        // В этой версии эффекта нажатия нет, только кликабельность.


        restartGame=()=>{skipIntro=true;this.scene.restart();};
        startNewRound.call(this);
        }

    function update(){
        if(!started||gameEnded)return;
        const speed=baseMeterSpeed*(isClutchMode?2.8:1.8);
        shotMeterPointer.x+=shotMeterDirection*speed;
        const half=meterBarWidth/2;
        const meterCenterX = shotMeterBar.x;
        if(shotMeterPointer.x>=meterCenterX+half||shotMeterPointer.x<=meterCenterX-half)shotMeterDirection*=-1;
        shotMeterPointer.x=Phaser.Math.Clamp(shotMeterPointer.x,meterCenterX-half,meterCenterX+half);
    }

    function startNewRound(){
        ball.setVisible(false);
        if(!playerList.length)return; // Should not happen if game state is managed correctly, but good safeguard
        currentPlayer=Phaser.Utils.Array.GetRandom(playerList);
        baseMeterSpeed=Phaser.Math.FloatBetween(2.7,3.3)*1.25;
        const key=currentPlayer.name.toLowerCase().replace(/[^a-z0-9]/g,'');
        playerSprite.setTexture(this.textures.exists(key)?key:'playerSilhouette1');
        updateAccuracyZones.call(this,currentPlayer); // Ensure zones are created/updated
        if(!isClutchMode&&canStartClutch&&!justExitedClutch&&Phaser.Math.Between(1,100)<=15)startClutchMode.call(this);
        justExitedClutch=false;
    }

    function updateAccuracyZones(player) {
        if (accuracyZonePerfect) accuracyZonePerfect.destroy();
        if (accuracyZoneGood)    accuracyZoneGood.destroy();

        let perfectW = 20, goodW = 60;
        switch (player.accuracy) {
            case 'perfect': perfectW = 40; goodW = 120; break;
            case 'high': perfectW = 30; goodW = 100; break;
            case 'medium': perfectW = 20; goodW = 60; break;
            case 'low': perfectW = 15; goodW = 45; break;
            case 'extremely low': perfectW = 5; goodW = 20; break;
        }

        const meterY = config.height - 150; // Y position for the zones (matches meter bar Y)

        // 0x00FF00 – bright green, alpha 0.8
        accuracyZonePerfect = this.add.rectangle(config.width/2, meterY, perfectW, meterBarHeight, 0x006D00)
            .setOrigin(0.5)
            .setAlpha(1)
            .setDepth(1.2); // Zone depth 1.2

        // 0x88FF88 – light green, alpha 0.6
        accuracyZoneGood = this.add.rectangle(config.width/2, meterY, goodW, meterBarHeight, 0x006D00)
            .setOrigin(0.5)
            .setAlpha(0.6)
            .setDepth(1.2); // Zone depth 1.2
    }

    function shoot() {
        console.log('SHOOT button pressed or SPACE key down'); // Добавьте этот лог
    if (gameEnded || ball.visible || !started) {
        console.log('Shoot blocked! Conditions:', {gameEnded, ballVisible: ball.visible, started}); // Добавьте этот лог
        return;
    }

        const playerBaseY = config.height - playerBaseDistanceFromBottom;
        this.tweens.add({
            targets: playerSprite,
            y: playerBaseY - playerJumpHeight,
            duration: 100,
            ease: 'Power2',
            yoyo: true
        });

        ball.x = playerSprite.x;
        ball.y = playerSprite.y;
        ball.setVisible(true);

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
        const baseDuration = 400;
        const hoopCenterX = config.width / 2;
        const hoopCenterY = backboard.y - 30;
        const hoopZoneRadius = 40; // Radius around hoop center miss should avoid

        if (!miss) {
            targetX = hoopCenterX + (shotMeterPointer.x - config.width / 2) * 0.05;
            targetY = hoopCenterY;
            duration = baseDuration;
        } else {
            const missType = Phaser.Math.RND.integerInRange(1, 4); // 1: Short, 2: Long, 3: Side, 4: Backboard
            duration = baseDuration + Phaser.Math.RND.integerInRange(-50, 100);

            switch (missType) {
                case 1: // Short / Under hoop
                    targetX = hoopCenterX + Phaser.Math.RND.integerInRange(-60, 60);
                    targetY = hoopCenterY + Phaser.Math.RND.integerInRange(hoopZoneRadius, 100);
                    break;
                case 2: // Long / Overshoot
                    targetX = hoopCenterX + Phaser.Math.RND.integerInRange(-80, 80);
                    targetY = hoopCenterY - Phaser.Math.RND.integerInRange(hoopZoneRadius + 20, 150);
                    break;
                case 3: // Wide (side miss)
                    const side = Phaser.Math.RND.pick([-1, 1]);
                    targetX = hoopCenterX + side * Phaser.Math.RND.integerInRange(hoopZoneRadius * 1.5, 200);
                    targetY = hoopCenterY + Phaser.Math.RND.integerInRange(-20, 20);
                    break;
                case 4: // Backboard miss (away from hoop)
                    let attempts = 0;
                    let distToHoopCenter;
                    do {
                        targetX = hoopCenterX + Phaser.Math.RND.integerInRange(-120, 120);
                        targetY = backboard.y + Phaser.Math.RND.integerInRange(-60, 60);

                        const dx = targetX - hoopCenterX;
                        const dy = targetY - hoopCenterY;
                        distToHoopCenter = Math.sqrt(dx * dx + dy * dy);

                        attempts++;
                        if (attempts > 100) { break; }
                    } while (distToHoopCenter < hoopZoneRadius);
                    break;
            }
        }

        this.tweens.add({
            targets: ball,
            x: targetX,
            y: targetY,
            duration: duration,
            ease: 'Linear',
            onComplete: () => {
                ball.setVisible(false);
                showPointsAndMessage.call(this, accuracy);

                if (!miss) {
                    madeShotsInRow++;
                } else {
                    madeShotsInRow = 0;
                }
                updateInfoBar.call(this);

                if (isClutchMode) {
                   endClutchMode.call(this);
                   startNewRound.call(this);
                } else if (!miss) {
                    startNewRound.call(this);
                }
            }
        });
    }

    function showPointsAndMessage(accuracy) {
        this.tweens.killTweensOf(pointsText);
        this.tweens.killTweensOf(messageText);

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

        pointsText.setText((pts > 0 ? '+' : '') + pts)
                  .setFill(color)
                  .setAlpha(1);
        messageText.setText(shotResultMessage)
                   .setFill(color)
                   .setAlpha(1);

        this.tweens.add({
            targets: [pointsText, messageText],
            alpha: 0,
            duration: 200,
            delay: 200
        });
    }

    function getAccuracy(){
        const x=shotMeterPointer.x;
        const pz=accuracyZonePerfect;
        const gz=accuracyZoneGood;

        if(x > pz.x - pz.width / 2 && x < pz.x + pz.width / 2) return 'perfect';

        if(x > gz.x - gz.width / 2 && x < gz.x + gz.width / 2) {
            return Phaser.Math.Between(1, 100) <= 20 ? 'lucky' : 'good';
        }

        return 'miss';
    }

    function countdown(){
        if(gameEnded||!started)return;
        timer--;
        updateInfoBar.call(this);
        if(timer<=0)endGame.call(this);
    }

    function startClutchMode(){
        isClutchMode=true;
        canStartClutch=false;
        justExitedClutch=false;
        infoBarGraphics.clear().fillStyle(0xFF0000,1).fillRect(0,0,config.width,80);
        clutchTime=7;
        if(clutchTimerEvent)clutchTimerEvent.remove();
        clutchTimerEvent=this.time.addEvent({delay:1000,callback:updateClutchTime,callbackScope:this,loop:true});
        timerText.setTint(0xFFFFFF);
    }

    function updateClutchTime(){
        clutchTime--;
        timerText.setText(clutchTime);
        if(clutchTime<=0)endClutchMode.call(this);
        if (clutchTime <= 3) {
             timerText.setAlpha(clutchTime % 2 === 0 ? 1 : 0.5);
        }
    }

    function endClutchMode(){
        isClutchMode=false;
        canStartClutch=true;
        justExitedClutch=true;
        if(clutchTimerEvent){
            clutchTimerEvent.remove();
            clutchTimerEvent=null;
        }
        infoBarGraphics.clear().fillStyle(0x333333,1).fillRect(0,0,config.width,80);
        timerText.setTint(0xFFFFFF);
        timerText.setAlpha(1);
        updateInfoBar.call(this);
    }

    function endGame(){
        this.add.rectangle(0,0,config.width,config.height,0x000000,0.85).setOrigin(0).setDepth(10000);
        gameEnded=true;
        updateInfoBar.call(this);

        infoBarGraphics.setVisible(false);
        scoreText.setVisible(false);
        this.children.each((child) => {
            if (child instanceof Phaser.GameObjects.Text && child.y < 80) {
                child.setVisible(false);
            }
        });

        const finalScoreText = this.add.text(config.width/2, config.height/2 - 150, `Final Score: ${score}`, {
            fontSize:'64px',
            fill:'#fff',
            fontFamily:'"Special Gothic Expanded One",monospace',
            align:'center'
        }).setOrigin(0.5).setDepth(10001);


        messageText.setText(getEndGameMessage())
                   .setFill('#fff')
                   .setAlpha(1)
                   .setWordWrapWidth(config.width-80)
                   .setOrigin(0.5)
                   .setPosition(config.width/2, config.height/2 - 50)
                   .setDepth(10001);


        const y=config.height/2+50;
        this.add.text(config.width/2,y,'Restart',{fontSize:'32px',fill:'#fff',backgroundColor:'#007bff',padding:{x:20,y:10},fontFamily:'"Special Gothic Expanded One",monospace',align:'center'})
            .setOrigin(0.5)
            .setDepth(10001)
            .setInteractive()
            .on('pointerdown',()=>{skipIntro=true;this.scene.restart();});

        this.add.text(config.width/2,y+60,'Share Score',{fontSize:'32px',fill:'#fff',backgroundColor:'#28a745',padding:{x:20,y:10},fontFamily:'"Special Gothic Expanded One",monospace',align:'center'})
            .setOrigin(0.5)
            .setDepth(10001)
            .setInteractive()
            .on('pointerdown',()=> {
                const shareText = `I scored ${score} points in Perfect Shot! Can you beat my score? #PerfectShotGame`;
                if (navigator.share) {
                    navigator.share({
                        title: 'Perfect Shot Score',
                        text: shareText,
                        url: window.location.href
                    }).catch((error) => console.log('Error sharing', error));
                } else {
                    alert(shareText);
                }
            });
    }

    function getEndGameMessage(){
        if(score<0)return'Did you even try?';
        if(score<10)return'Stick to layups.';
        if(score<20)return'Bench warmer energy.';
        if(score<40)return'Cooking out here!';
        if(score<60)return'Heat Check!';
        if(score<80)return'Pure Shooter!';
        return'Legendary!';
    }

    function updateInfoBar(){
        let timeDisplay;
        if (started) {
             timeDisplay = isClutchMode ? `${clutchTime}` : (timer < 10 ? `:0${timer}` : `:${timer}`);
        } else {
             timeDisplay = `:60`;
        }
        timerText.setText(timeDisplay);
        scoreText.setText(score);
        streakText.setText(`x${madeShotsInRow || 0}`);
    }

});