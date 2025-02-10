class FirstScene extends Phaser.Scene {
    constructor() {
        super("FirstScene");
        this.isSpawningObstacles = false;
        this.startTime = 0;
        this.jumpCount = 0;
        this.isJumping = false;
        this.lastFired = 0;
        this.gunVisible = false;
    }

    init() {
        this.gunVisible = false;
    }

    preload() {
        this.load.image("bg", "Assets/bg1.png");
        this.load.image("obstacle", "Assets/Car.png");
        this.load.spritesheet("camel", "Assets/Crazy Camel Spritesheet.png", {
            frameWidth: 220,
            frameHeight: 150,
        });
        this.load.image("gun", "Assets/Gun.png");
        this.load.image("bullet", "Assets/Bullet.png");
        this.load.image("scope", "Assets/Scope.png");
        this.load.audio('jumpSound', 'Assets/Jump.mp3');
        this.load.audio('foundGunSound', 'Assets/FoundGun.mp3');
        this.load.audio('fireSound', 'Assets/Fire.mp3');
        this.load.audio('GameOverSound', 'Assets/GameOver.mp3');
    }

    create() {
        this.startTime = performance.now();
    
        this.background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg").setOrigin(0, 0);
    
        this.camel = this.physics.add.sprite(200, 620, "camel").setCollideWorldBounds(true).setGravityY(500);
        this.anims.create({
            key: "camel_anim",
            frames: this.anims.generateFrameNumbers("camel"),
            frameRate: 10,
            repeat: -1,
        });
        this.camel.play("camel_anim");
    
        this.gun = this.add.image(this.camel.x, this.camel.y - 60, "gun").setOrigin(0.5, 0.5).setVisible(false);
    
        this.bullets = this.physics.add.group();
    
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    
        this.timeText = this.add.text(1000, 10, 'Time: 0', { font: '32px Calibri', fill: '#000000' }).setOrigin(0, 0);
    
        this.obstacles = this.physics.add.group();
        this.addObstacle();
        this.physics.add.collider(this.camel, this.obstacles, this.gameOver, null, this);
    
        this.physics.add.collider(this.bullets, this.obstacles, this.handleBulletHitObstacle, null, this);
    
        this.input.setDefaultCursor('none');
    
        this.scopeCursor = this.add.image(0, 0, "scope").setOrigin(0.5, 0.5).setVisible(false).setDepth(1000).setScale(0.7);
    }
    

    update(time) {
        this.background.tilePositionX += 2;

        if (this.keyD.isDown) {
            this.camel.anims.timeScale = 1.4;
        } else if (this.keyA.isDown) {
            this.camel.anims.timeScale = 0.6;
        } else {
            this.camel.anims.timeScale = 1;
        }

        if (this.cursorKeys.space.isDown && this.jumpCount < 3 && !this.isJumping) {
            this.camel.setVelocityY(-400);
            this.isJumping = true;
            this.sound.play('jumpSound');
        }
        if (this.camel.body.velocity.y > 0 && this.isJumping) {
            this.jumpCount++;
            this.isJumping = false;
        }
        if (this.camel.y >= 600) {
            this.jumpCount = 0;
        }

        if (this.keyA.isDown) {
            this.camel.setVelocityX(-200);
        } else if (this.keyD.isDown) {
            this.camel.setVelocityX(200);
        } else {
            this.camel.setVelocityX(0);
        }

        const timeElapsed = (performance.now() - this.startTime) / 1000;
        if (timeElapsed >= 10 && !this.gunVisible) {
            this.gun.setVisible(true);
            this.gunVisible = true;
            this.sound.play('foundGunSound');
        }

        if (this.gunVisible) {
            this.gun.x = this.camel.x;
            this.gun.y = this.camel.y - 60;

            const pointer = this.input.activePointer;
            const angle = Phaser.Math.Angle.Between(this.gun.x, this.gun.y, pointer.worldX, pointer.worldY);
            this.gun.setRotation(angle);

            this.gun.flipY = pointer.worldX < this.gun.x;

            this.scopeCursor.setPosition(pointer.worldX, pointer.worldY).setVisible(true);

            if (pointer.isDown && time > this.lastFired + 500) {
                this.fireBullet(angle);
                this.lastFired = time;
                this.sound.play('fireSound');
            }
        } else {
            this.scopeCursor.setVisible(false);
        }

        this.obstacles.getChildren().forEach((obstacle) => {
            if (obstacle.x < -300) {
                obstacle.destroy();
                this.isSpawningObstacles = false;
            }
        });
        if (!this.isSpawningObstacles) {
            this.addObstacle();
            this.isSpawningObstacles = true;
        }

        const seconds = Math.floor(timeElapsed);
        const milliseconds = Math.floor((timeElapsed % 1) * 1000);
        this.timeText.setText(`Time: ${seconds}.${milliseconds.toString().padStart(3, "0")}`);
    }

    fireBullet(angle) {
        const bullet = this.bullets.create(this.gun.x, this.gun.y, "bullet");
        const speed = 800;
        bullet.setRotation(angle);
        bullet.body.velocity.x = Math.cos(angle) * speed;
        bullet.body.velocity.y = Math.sin(angle) * speed;

        bullet.setCollideWorldBounds(true);
        bullet.body.onWorldBounds = true;
        bullet.body.allowGravity = false;

        bullet.body.world.on('worldbounds', (body) => {
            if (body.gameObject === bullet) {
                bullet.destroy();
            }
        });

        this.time.delayedCall(2000, () => {
            if (bullet.active) bullet.destroy();
        });
    }

    handleBulletHitObstacle(bullet, obstacle) {
        bullet.destroy();
        obstacle.destroy();
        this.addObstacle();
    }

    addObstacle() {
        const randomGap = Phaser.Math.Between(300, 500);
        const obstacleX = this.cameras.main.width + randomGap;
        const obstacleY = 620;
        const obstacle = this.obstacles.get(obstacleX, obstacleY, "obstacle");

        if (!obstacle) {
            this.setObstacleProperties(this.obstacles.create(obstacleX, obstacleY, "obstacle"));
        } else {
            obstacle.setActive(true);
            obstacle.setVisible(true);
            this.setObstacleProperties(obstacle);
        }
    }

    setObstacleProperties(obstacle) {
        const randomVelocity = Phaser.Math.Between(-100, -450);
        obstacle.setVelocityX(randomVelocity);
        obstacle.setCollideWorldBounds(false);
        obstacle.body.allowGravity = false;
    }

    gameOver() {
        const elapsedTime = performance.now() - this.startTime;
        this.sound.play('GameOverSound');
        this.scene.start("GameOverScene", { elapsedTime });
    }
}
