class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.elapsedTime = data.elapsedTime; 
    }

    preload() {
        this.load.image("bg", "Assets/bg1.png");
        this.load.audio('startSound', 'Assets/Start.mp3');
    }

    create() {
        const seconds = Math.floor(this.elapsedTime / 1000);
        const milliseconds = Math.floor(this.elapsedTime % 1000).toString().padStart(3, "0");

        let bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg");
        bg.setOrigin(0, 0);
        bg.setAlpha(0.5);

        this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 3, "Game Over", {
            fontSize: '64px Calibri',
            fill: '#000000'
        }).setOrigin(0.5);

        this.timeText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, `Time: ${seconds}.${milliseconds}`, {
            fontSize: '32px Calibri',
            fill: '#000000'
        }).setOrigin(0.5);

        this.replayLabel = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 1.5, "Press Space Bar to replay", {
            fontSize: '32px Calibri',
            fill: '#000000'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.sound.play('startSound');
            this.scene.start("FirstScene");
        });
    }
}
