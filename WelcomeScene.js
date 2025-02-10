class WelcomeScene extends Phaser.Scene {
    constructor() {
        super("WelcomeScene");
    }

    preload() {
        this.load.image("bg", "Assets/bg1.png");
        this.load.audio('startSound', 'Assets/Start.mp3');
    }

    create() {
        let bg = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg");
        bg.setOrigin(0, 0);
        bg.setAlpha(0.5);

        this.title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 4, "Crazy Camel", {
            fontSize: '72px Calibri',
            fill: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const instructions = [
            "Press A to move backwards",
            "Press D to move forward",
            "Press Space Bar to triple jump",
            "",
            "After 10 seconds of playing you'll get a power-up, a gun!",
            "Aim with mouse pointer",
            "Fire with left mouse button",
        ];

        const instructionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, instructions.join('\n'), {
            fontSize: '28px Calibri',
            fill: '#000000',
            align: 'center',
        }).setOrigin(0.5);

        this.label = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 0.8, "Press Space Bar to Play", {
            fontSize: '36px Calibri',
            fill: '#ff0000',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.sound.play('startSound');
            this.scene.start("FirstScene");
        });
    }
}
