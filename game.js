window.onload = function() {
    var config = {
        width: 1206,
        height: 678,
        backgroundColor: 0xebbd34,
        scene: [WelcomeScene, FirstScene, GameOverScene],
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        }
    }
    var game = new Phaser.Game(config);
}
