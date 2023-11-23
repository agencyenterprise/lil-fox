import semver from "semver";
import * as Math from "mathjs";
import { Button } from "@/components";
import Error from "next/error";
import { ethers } from "ethers";

export class FoxGame extends Phaser.Scene {
  public tips = [
    // beginner
    "Don’t be a total greenhorn! Brush up on the basics of blockchain technology before jumping into the world of MetaMask with MetaMask Learn: **learn.metamask.io**",
    "Be clever like a fox! Get savvy with the MetaMask knowledge base to start your journey in crypto: **support.metamask.io**",
    "Guard your seed phrase like a fox guards its den - keep it safe and secure! Never share it with anyone, not even someone who claims to be from MetaMask!",
    "Psst! Keep your seed phrase or private key under wraps, like a fox keeping its den out of sight.",
    "Take baby steps and start with small transactions to get the hang of MetaMask, just like a curious fox testing the waters.",
    "Don't let gas fees sneak up on you! Learn about fees before you start making transactions.",
    "Stay sharp and keep your wits about you. Only use official MetaMask websites and links. Don't be fooled by imitators!",
    // intermediate
    "Add some foxy flair to your MetaMask wallet by customizing it with your favorite tokens for quick access.",
    "Keep the good times rolling with the MetaMask mobile app. Take your wallet with you when you're a fox on the run!",
    "Use the swap feature in MetaMask to exchange assets and tokens with ease, then you can relax like a lazy fox!",
    "Keep your tokens safe and your mind at ease by checking gas fees on the Ethereum network before making transactions.",
    "Separate your crypto holdings by setting up multiple accounts in MetaMask.",
    "Surf the web and access your wallet at the same time with the MetaMask browser extension. It’s like a fox on the prowl, always on the lookout!",
    "Like a fox masking its scent, keep your online identity hidden from prying eyes with a VPN!",
    // advanced
    "Get foxy and connect your MetaMask wallet with your own applications using the MetaMask API. You’re a coding whiz!",
    "Like a sly fox, you can outsmart the competition with MetaMask's advanced gas settings for your transactions.",
    "Switch it up! Use the MetaMask network settings to hop between different Ethereum networks like a nimble fox.",
    "Get out there and investigate like a fantastic fox. Explore the details of your transaction history on Etherscan!",
    "Tax season got you down? No sweat! Export your transaction history from MetaMask for easy tax filing.",
    "Say goodbye to old-school passwords and hello to decentralized identity with MetaMask's Sign In With Ethereum feature.",
    "Track your balances across all your accounts with the MetaMask Portfolio: **portfolio.metamask.io**",
    // tax tips
    "Taxes may be sly, but you can outfox them with MetaMask’s built-in transaction tracker and export tools.",
    "Filing taxes can be a tricky game of cat and mouse, but with MetaMask’s detailed transaction history, you’ll be as sly as a fox.",
  ];
  public xFoxScale: number = 4;
  public yFoxScale: number = 4;
  public walking: boolean = false;
  public interacting: boolean = false;
  public cleaning: boolean = false;
  public delayCounter: number = 0;
  public poopCounter: number = 0;
  public rectWidth = 800;
  public bgColor = 0x9f1bf5;
  public fgColor = 0xfed5fb;
  public idleKey = "idle";
  public ethereumWallet: any;
  public interval: any;
  public foxSnapId: string = "npm:@ae-studio/pet-fox";
  public foxSnapVersion = "^0.2.8";
  public ipfsSnapId = "npm:@ae-studio/snapsync";
  public ipfsSnapVersion = "^0.2.4";
  public autosaveInterval = 60;
  public hasInitialized = false;
  public availableSkins = ["default", "blue"];
  public selectedSkin = "default";
  public textName: Phaser.GameObjects.BitmapText;
  public textHealth: Phaser.GameObjects.BitmapText;
  public textHunger: Phaser.GameObjects.BitmapText;
  public textHappiness: Phaser.GameObjects.BitmapText;
  public textAge: Phaser.GameObjects.BitmapText;
  public poops: Phaser.GameObjects.Group;
  public foxSprite: Phaser.GameObjects.Sprite;
  public moveTween: Phaser.Tweens.Tween;

  constructor() {
    super();
  }

  loadAnimations() {
    this.anims.create({
      key: "idle-default",
      frames: this.anims.generateFrameNumbers("idle-default"),
      frameRate: 8,
    });
    this.anims.create({
      key: "crouch-default",
      frames: this.anims.generateFrameNumbers("crouch-default"),
      frameRate: 8,
    });
    this.anims.create({
      key: "sit-default",
      frames: this.anims.generateFrameNumbers("sit-default"),
      frameRate: 8,
    });
    this.anims.create({
      key: "sneak-default",
      frames: this.anims.generateFrameNumbers("sneak-default"),
      frameRate: 8,
    });
    this.anims.create({
      key: "walk-default",
      frames: this.anims.generateFrameNumbers("walk-default"),
      frameRate: 8,
    });
    this.anims.create({
      key: "run-default",
      frames: this.anims.generateFrameNumbers("run-default"),
      frameRate: 8,
    });
    this.anims.create({
      key: "hurt-default",
      frames: this.anims.generateFrameNumbers("hurt-default"),
      frameRate: 8,
    });
    this.anims.create({
      key: "die-default",
      frames: this.anims.generateFrameNumbers("die-default"),
      frameRate: 8,
    });

    this.anims.create({
      key: "idle-blue",
      frames: this.anims.generateFrameNumbers("idle-blue"),
      frameRate: 8,
    });
    this.anims.create({
      key: "crouch-blue",
      frames: this.anims.generateFrameNumbers("crouch-blue"),
      frameRate: 8,
    });
    this.anims.create({
      key: "sit-blue",
      frames: this.anims.generateFrameNumbers("sit-blue"),
      frameRate: 8,
    });
    this.anims.create({
      key: "sneak-blue",
      frames: this.anims.generateFrameNumbers("sneak-blue"),
      frameRate: 8,
    });
    this.anims.create({
      key: "walk-blue",
      frames: this.anims.generateFrameNumbers("walk-blue"),
      frameRate: 8,
    });
    this.anims.create({
      key: "run-blue",
      frames: this.anims.generateFrameNumbers("run-blue"),
      frameRate: 8,
    });
    this.anims.create({
      key: "hurt-blue",
      frames: this.anims.generateFrameNumbers("hurt-blue"),
      frameRate: 8,
    });
    this.anims.create({
      key: "die-blue",
      frames: this.anims.generateFrameNumbers("die-blue"),
      frameRate: 8,
    });

    this.anims.create({
      key: "food",
      frames: this.anims.generateFrameNumbers("food"),
      frameRate: 2,
    });
  }

  setInterface(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(16, 556, 72, 36);
    graphics.fillStyle(0x6effeb, 1);
    graphics.fillRect(12, 552, 72, 36);
    const feedButton = new Button(48, 572, "Feed", this, () => {
      if (this.interacting) {
        return;
      }
      this.interacting = true;
      if (this.walking) {
        this.foxSprite.anims.stop();
        try {
          this.moveTween.stop();
        } catch {}
        this.walking = false;
      }
      const xModifier = this.xFoxScale > 0 ? 45 : -45;
      const xScaleModifier = this.xFoxScale > 0 ? -2 : 2;
      const fallenFood = this.add
        .sprite(this.foxSprite.x + xModifier, this.foxSprite.y + 24, "food")
        .setScale(xScaleModifier, 2);
      fallenFood.play("food").once("animationcomplete", () => {
        fallenFood.destroy();
      });
      this.foxSprite
        .play({
          key: `sneak-${this.selectedSkin}`,
          repeat: 3,
        })
        .once("animationcomplete", () => {
          console.log("completed");
          this.foxFeed();
          this.foxSprite.play({
            key: `${this.idleKey}-${this.selectedSkin}`,
            repeat: -1,
          });
          this.interacting = false;
        });
    });

    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(112, 556, 72, 36);
    graphics.fillStyle(0x6effeb, 1);
    graphics.fillRect(108, 552, 72, 36);
    const petButton = new Button(144, 572, "Pet", this, () => {
      if (this.interacting) {
        return;
      }
      this.interacting = true;
      if (this.walking) {
        this.foxSprite.anims.stop();
        try {
          this.moveTween.stop();
        } catch {}
        this.walking = false;
      }
      const xModifier = this.xFoxScale > 0 ? 12 : -12;
      const floatingHeart = this.add
        .sprite(this.foxSprite.x + xModifier, this.foxSprite.y - 14, "icons", 0)
        .setScale(2);
      floatingHeart.setTintFill(0xff0000);
      // create a tween to move the sprite upward and fade it out
      this.tweens.add({
        targets: floatingHeart,
        y: floatingHeart.y - 36, // move the sprite upward by 36 pixels
        alpha: 0, // set the alpha of the sprite to 0 (fully transparent)
        duration: 2000, // make the tween last for 1000 milliseconds (1 second)
        onComplete: () => {
          // remove the sprite when the tween is complete
          floatingHeart.destroy();
        },
      });
      this.foxSprite
        .play({
          key: `sit-${this.selectedSkin}`,
          repeat: 2,
        })
        .once("animationcomplete", () => {
          this.foxPet();
          this.foxSprite.play({
            key: `${this.idleKey}-${this.selectedSkin}`,
            repeat: -1,
          });
          this.interacting = false;
        });
    });

    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(208, 556, 72, 36);
    graphics.fillStyle(0x6effeb, 1);
    graphics.fillRect(204, 552, 72, 36);
    const healButton = new Button(240, 572, "Heal", this, () => {
      if (this.interacting) {
        return;
      }
      this.interacting = true;
      if (this.walking) {
        this.foxSprite.anims.stop();
        try {
          this.moveTween.stop();
        } catch {}
        this.walking = false;
      }
      const xModifier = this.xFoxScale > 0 ? 12 : -12;
      const floatingPill = this.add
        .sprite(this.foxSprite.x + xModifier, this.foxSprite.y - 24, "icons", 4)
        .setScale(2);
      // create a tween to move the sprite downward and fade it out
      this.tweens.add({
        targets: floatingPill,
        y: floatingPill.y + 36, // move the sprite upward by 36 pixels
        alpha: 0, // set the alpha of the sprite to 0 (fully transparent)
        duration: 1900, // make the tween last for 1000 milliseconds (1 second)
        onComplete: function () {
          // remove the sprite when the tween is complete
          floatingPill.destroy();
        },
      });
      this.foxSprite
        .play({
          key: `crouch-${this.selectedSkin}`,
          repeat: 1,
        })
        .once("animationcomplete", () => {
          this.foxHeal();
          this.foxSprite.play({
            key: `${this.idleKey}-${this.selectedSkin}`,
            repeat: -1,
          });
          this.interacting = false;
        });
    });

    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(304, 556, 72, 36);
    graphics.fillStyle(0x6effeb, 1);
    graphics.fillRect(300, 552, 72, 36);
    const askButton = new Button(336, 572, "Ask", this, () => {
      if (this.interacting) {
        return;
      }
      this.interacting = true;
      if (this.walking) {
        this.foxSprite.anims.stop();
        try {
          this.moveTween.stop();
        } catch {}
        this.walking = false;
      }
      const xModifier = this.xFoxScale > 0 ? 12 : -12;
      const floatingQ = this.add
        .sprite(this.foxSprite.x + xModifier, this.foxSprite.y - 18, "icons", 5)
        .setScale(2);
      floatingQ.setTintFill(0x9f1bf5);
      // create a tween to move the sprite upward and fade it out
      this.tweens.add({
        targets: floatingQ,
        y: floatingQ.y - 36, // move the sprite upward by 36 pixels
        alpha: 0, // set the alpha of the sprite to 0 (fully transparent)
        duration: 2000, // make the tween last for 1000 milliseconds (1 second)
        onComplete: function () {
          // remove the sprite when the tween is complete
          floatingQ.destroy();
        },
      });
      this.foxSprite
        .play({
          key: `sit-${this.selectedSkin}`,
          repeat: 2,
        })
        .once("animationcomplete", () => {
          this.foxSprite.play({
            key: `${this.idleKey}-${this.selectedSkin}`,
            repeat: -1,
          });
          this.interacting = false;
        });
      this.foxAsk();
    });

    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(404, 556, 76, 36);
    graphics.fillStyle(0x6effeb, 1);
    graphics.fillRect(400, 552, 76, 36);
    const photoButton = new Button(438, 572, "Photo", this, () => {
      if (this.interacting) {
        return;
      }
      this.interacting = true;
      const picEl = document.getElementById("pic");
      const imgEl = document.createElement("img");
      imgEl.height = 256;
      imgEl.width = 256;
      imgEl.src = "/nyan.gif";
      if (!picEl) {
        return;
      }
      picEl.replaceChildren(imgEl);
      picEl.style.opacity = "1";
      picEl.style.display = "block";
      this.foxLoad()
        .then((fox) => {
          if (!fox) {
            return;
          }
          this.updateUI(fox);
          fetch("https://fanflixcreator.com/api/lilfox", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fox),
          })
            .then((response) => response.json())
            .then((data) => {
              imgEl.src = data;
              this.interacting = false;
            })
            .catch((error) => {
              console.error("Error fetching:", error);
              this.interacting = false;
            });
        })
        .catch(console.error);
    });

    let menuPosition = 520;
    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(menuPosition, 556, 72, 36);
    graphics.fillStyle(0x6effeb, 1);
    graphics.fillRect(menuPosition - 4, 552, 72, 36);
    const newButton = new Button(menuPosition + 32, 572, "New", this, () => {
      this.interacting = false;
      this.walking = false;
      this.cleaning = false;
      this.delayCounter = 0;
      this.poopCounter = 0;
      this.idleKey = `idle-${this.selectedSkin}`;
      this.foxAdopt().then(() => {
        setTimeout(() => {
          this.run();
          this.interval = setInterval(this.run, 500);
        }, 200);
      });
    });

    menuPosition += 96;

    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(menuPosition, 556, 72, 36);
    graphics.fillStyle(0x6effeb, 1);
    graphics.fillRect(menuPosition - 4, 552, 72, 36);
    const saveButton = new Button(menuPosition + 32, 572, "Save", this, () => {
      this.foxPersist()
        .then((fox) => {
          console.info("persisted fox", fox);
        })
        .catch(console.error);
    });

    menuPosition += 96;

    graphics.fillStyle(0xffffff, 0.5);
    graphics.fillRect(menuPosition, 556, 72, 36);
    graphics.fillStyle(0x6effeb, 1);
    graphics.fillRect(menuPosition - 4, 552, 72, 36);
    const loadButton = new Button(menuPosition + 32, 572, "Load", this, () => {
      this.foxLoad()
        .then((fox) => {
          console.info("loaded fox", fox);
          if (!fox) {
            return;
          }
          this.updateUI(fox);
        })
        .catch(console.error);
    });
  }

  setEnvironment() {
    let graphics = this.add.graphics();
    // Set the fill color to e4761b
    graphics.fillStyle(this.bgColor, 1);
    // Draw a rectangle at position 0,0 with a width of 800 and a height of 60
    graphics.fillRect(0, 0, this.rectWidth, 60);

    for (var i = 0; i < 40; i++) {
      let shouldBother = Phaser.Math.RND.between(0, 1);
      if (shouldBother) {
        let spriteIndex = Phaser.Math.RND.between(0, 5);
        let col = i % 8;
        let row = Math.floor(i / 8);
        let x = 64 + col * 96 + Phaser.Math.RND.between(-36, 36);
        let y = 120 + row * 88 + Phaser.Math.RND.between(-24, 24);
        this.add.image(x, y, "flora", spriteIndex).setScale(3);
      }
    }

    graphics.fillStyle(this.fgColor, 1);
    graphics.fillRoundedRect(12, 12, 300, 36, 10);
    this.textName = this.add.bitmapText(25, 21, "pixelfont", "Fox", 20);

    graphics.fillRoundedRect(336, 12, 88, 36, 10);
    this.add.image(342, 15, "icons", 0).setOrigin(0, 0).setScale(2);
    this.textHealth = this.add
      .bitmapText(416, 21, "pixelfont", "100", 20)
      .setOrigin(1, 0);

    graphics.fillRoundedRect(448, 12, 88, 36, 10);
    this.add.image(454, 15, "icons", 1).setOrigin(0, 0).setScale(2);
    this.textHunger = this.add
      .bitmapText(528, 21, "pixelfont", "100", 20)
      .setOrigin(1, 0);

    graphics.fillRoundedRect(560, 12, 88, 36, 10);
    this.add.image(566, 14, "icons", 2).setOrigin(0, 0).setScale(2);
    this.textHappiness = this.add
      .bitmapText(640, 21, "pixelfont", "100", 20)
      .setOrigin(1, 0);

    graphics.fillRoundedRect(672, 12, 88, 36, 10);
    this.add.image(678, 14, "icons", 3).setOrigin(0, 0).setScale(2);
    this.textAge = this.add
      .bitmapText(752, 21, "pixelfont", "0", 20)
      .setOrigin(1, 0);

    graphics.fillStyle(this.bgColor, 1);
    graphics.fillRect(0, 540, this.rectWidth, 60);

    this.loadAnimations();
    this.poops = this.add.group();
    this.setInterface(graphics);
  }

  preload() {
    this.load.spritesheet("icons", "/assets/sprites/icons.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(
      "idle-blue",
      "/assets/animations/fox/blue/lilfox_idle_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "crouch-blue",
      "/assets/animations/fox/blue/lilfox_crouch_strip8.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "sit-blue",
      "/assets/animations/fox/blue/lilfox_sit_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "sneak-blue",
      "/assets/animations/fox/blue/lilfox_sneak_strip4.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "run-blue",
      "/assets/animations/fox/blue/lilfox_run_strip4.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "walk-blue",
      "/assets/animations/fox/blue/lilfox_walk_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "hurt-blue",
      "/assets/animations/fox/blue/lilfox_hurt_strip5.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "die-blue",
      "/assets/animations/fox/blue/lilfox_die_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );

    this.load.spritesheet(
      "idle-default",
      "/assets/animations/fox/default/lilfox_idle_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "crouch-default",
      "/assets/animations/fox/default/lilfox_crouch_strip8.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "sit-default",
      "/assets/animations/fox/default/lilfox_sit_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "sneak-default",
      "/assets/animations/fox/default/lilfox_sneak_strip4.png",
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      "run-default",
      "/assets/animations/fox/default/lilfox_run_strip4.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "walk-default",
      "/assets/animations/fox/default/lilfox_walk_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "hurt-default",
      "/assets/animations/fox/default/lilfox_hurt_strip5.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      "die-default",
      "/assets/animations/fox/default/lilfox_die_strip8.png",
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet("food", "/assets/sprites/food.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet("flora", "/assets/sprites/flora.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.bitmapFont(
      "pixelfont",
      "/assets/fonts/minogram_6x10.png",
      "/assets/fonts/minogram_6x10.xml"
    );
  }

  create() {
    if (window.ethereum !== undefined) {
      this.ethereumWallet = window.ethereum;
    }
    this.setEnvironment();
    this.foxSprite = this.add
      .sprite(
        Phaser.Math.RND.between(64, this.rectWidth - 64),
        Phaser.Math.RND.between(94, 506),
        `idle-${this.selectedSkin}`
      )
      .setScale(this.xFoxScale, this.yFoxScale);
    if (this.foxSprite.x > 500) {
      this.xFoxScale = -this.xFoxScale;
      this.foxSprite.setScale(this.xFoxScale, this.yFoxScale);
    }

    this.foxSprite.play({
      key: `${this.idleKey}-${this.selectedSkin}`,
      repeat: -1,
    });
    this.connectSnap();
  }

  update() {
    this.children.bringToTop(this.foxSprite);
    if (!this.interacting && !this.walking && this.idleKey == "idle") {
      this.delayCounter++;
      if (this.delayCounter > 60) {
        const shouldWalk = Phaser.Math.RND.between(1, 10);
        if (shouldWalk > 9) {
          this.walking = true;
          // let's walk
          let newX = Phaser.Math.RND.between(50, 750);
          let newY = Phaser.Math.RND.between(100, 500);
          if (
            (this.xFoxScale > 0 && newX < this.foxSprite.x) ||
            (this.xFoxScale < 0 && newX > this.foxSprite.x)
          ) {
            this.xFoxScale = -this.xFoxScale;
          }
          const distance = Phaser.Math.Distance.Between(
            this.foxSprite.x,
            this.foxSprite.y,
            newX,
            newY
          );
          let key = "walk";
          let duration = 10 * distance;
          if (distance > 300) {
            key = "run";
            duration = 6 * distance;
          }
          this.foxSprite.setScale(this.xFoxScale, this.yFoxScale).play({
            key: `${key}-${this.selectedSkin}`,
            repeat: -1,
          });
          // tween the sprite to the new position
          this.moveTween = this.tweens.add({
            targets: this.foxSprite,
            x: newX,
            y: newY,
            duration: duration,
            onComplete: () => {
              // destroy the sprite when the tween is complete
              this.foxSprite.play({
                key: `${this.idleKey}-${this.selectedSkin}`,
                repeat: -1,
              });
              this.walking = false;
            },
          });
        }
        this.delayCounter = 0;
      }
    }
    if (!this.cleaning && this.poops.getLength() < this.poopCounter) {
      let rX = Phaser.Math.RND.between(36, 766);
      let rY = Phaser.Math.RND.between(106, 504);
      if (this.poopCounter == this.poops.getLength() + 1) {
        let xFoxModifer = this.xFoxScale > 0 ? -42 : 42;
        // most recent poop. drop it where the fox is at.
        rX = this.foxSprite.x + xFoxModifer;
        rY = this.foxSprite.y + 19;
      }
      let aPoop = this.add
        .image(rX, rY, "icons", 6)
        .setOrigin(0.5, 0.5)
        .setScale(2)
        .setInteractive({ useHandCursor: true });
      aPoop.on("pointerdown", () => {
        this.cleaning = true;
        this.foxClean().then(() => {
          this.poops.remove(aPoop, true, true);
          this.poopCounter--;
          this.foxSay();
          this.cleaning = false;
        });
      });
      this.poops.add(aPoop);
    } else if (!this.cleaning && this.poops.getLength() > this.poopCounter) {
      let aPoop = this.poops.getLast(true);
      this.poops.remove(aPoop, true, true);
    }

    try {
      let currentKey = this.foxSprite.anims.getName();
      if (
        ("hurt" == this.idleKey && "idle" == currentKey) ||
        ("idle" == this.idleKey && "hurt" == currentKey)
      ) {
        this.foxSprite.anims.stop();
        try {
          this.moveTween.stop();
        } catch {}
        this.foxSprite.play({
          key: `${this.idleKey}-${this.selectedSkin}`,
          repeat: -1,
        });
      } else if ("die" == this.idleKey && "die" != currentKey) {
        this.foxSprite.play({
          key: `${this.idleKey}-${this.selectedSkin}`,
          repeat: 0,
        });
        this.interacting = true;
      }
    } catch {}
  }

  initializeState = async () => {
    if (this.hasInitialized) return;
    this.hasInitialized = true;

    try {
      const fox = await this.foxLoad();
      this.selectedSkin = fox.skin ?? "default";
    } catch (error) {
      this.hasInitialized = false;
      throw error;
    }
  };

  connectSnap = async () => {
    const provider = this.ethereumWallet;

    try {
      const installedSnap = await this.confirmFoxSnapInstalled();

      if (installedSnap) {
        const foxExists = await provider.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: this.foxSnapId,
            request: {
              method: "check",
              params: {
                ownerAddress: await this.getUserAddress(),
              },
            },
          },
        });

        if (foxExists) {
          await this.initializeState(); // Load existing fox
          this.styleAutosaveButton();
          this.styleSkinButtons();
          this.run();
          this.interval = setInterval(this.run, 500);
        } else {
          provider
            .request({
              method: "wallet_invokeSnap",
              params: {
                snapId: this.foxSnapId,
                request: {
                  method: "hello",
                },
              },
            })
            .then(() => {
              this.run();
              this.interval = setInterval(this.run, 500);
            });
        }
      }
    } catch {}
    return false;
  };

  run = () => {
    this.ethereumWallet
      .request({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.foxSnapId,
          request: {
            method: "update",
          },
        },
      })
      .then((fox: any) => this.updateUI(fox))
      .then(() => {
        if (!this.shouldAutosave()) {
          return;
        }

        this.autosaveInterval++;
        if (this.autosaveInterval < 60) {
          return;
        }

        this.autosaveInterval = 0;
        this.foxPersist()
          .then((fox) => {
            console.info("autosaved fox", fox);
          })
          .catch(console.error);
      });
  };

  closeGame = async (event?: any) => {
    try {
      event.preventDefault();
    } catch (error) {}
    clearInterval(this.interval);
    this.interacting = false;
    this.walking = false;
    this.delayCounter = 0;
    this.game.destroy(true, false);
  };

  styleAutosaveButton = () => {
    const autosave = this.shouldAutosave();
    document.documentElement.style.setProperty(
      "--autosaveBorder",
      `var(--${autosave ? "white" : "purple"}Border)`
    );
    document.documentElement.style.setProperty(
      "--autosaveBeforeBorder",
      `var(--${autosave ? "purple" : "white"}Border)`
    );
    document.documentElement.style.setProperty(
      "--autosaveBackground",
      `var(--${autosave ? "dark" : "light"}Background)`
    );
  };

  styleSkinButtons = () => {
    const skinButtons = document.getElementsByClassName("skin-button");
    Array.from(skinButtons).forEach((button: any) => {
      button.classList.remove("button-active");
      if (button.id == this.selectedSkin) {
        button.classList.add("button-active");
        button.classList.remove("button-inactive");
      } else {
        button.classList.remove("button-active");
        button.classList.add("button-inactive");
      }
    });
  };

  shouldAutosave = () => {
    return Boolean(JSON.parse(localStorage.getItem("autosave") ?? "false"));
  };

  setAutosave = async () => {
    const installedSnap = await this.confirmIPFSSyncSnapInstalled();
    if (!installedSnap) {
      return;
    }
    localStorage.setItem("autosave", JSON.stringify(!this.shouldAutosave()));
    this.styleAutosaveButton();
  };

  updateUI = (fox: any) => {
    const age = fox.age / (1000 * 3600 * 24);
    this.textName.text = fox.name;

    this.textHealth.text = `${Math.ceil(fox.health ?? 0)}`;
    this.textHunger.text = `${Math.ceil(fox.hunger ?? 0)}`;
    this.textHappiness.text = `${Math.ceil(fox.happiness ?? 0)}`;
    /*
      if(curHealth==null) { 
        textHealth.text = ''+parseInt(Math.ceil(fox.health)); 
      }
      curHealth = parseInt(Math.ceil(fox.health)); 
      if(curHunger==null) { 
        textHunger.text = ''+parseInt(Math.ceil(fox.hunger)); 
      }
      curHunger = parseInt(Math.ceil(fox.hunger)); 
      if(curHappiness==null) { 
        textHappiness.text = ''+parseInt(Math.ceil(fox.happiness)); 
      }
      curHappiness = parseInt(Math.ceil(fox.happiness)); 
      */
    this.selectedSkin = fox.skin ?? "default";
    this.styleSkinButtons();
    this.textAge.text = `${Math.floor(age)}`;
    if (!this.cleaning) {
      this.poopCounter = parseInt(fox.dirty);
    }
    if (fox.health < 1) {
      this.idleKey = "die";
    } else if (fox.health < 60) {
      this.idleKey = "hurt";
    } else {
      this.idleKey = "idle";
    }
  };

  getSnap = async (snapId: string, snapVersion: string) => {
    try {
      const snaps = await this.ethereumWallet.request({
        method: "wallet_getSnaps",
      });
      return Object.values(snaps).find(
        (snap: any) =>
          snap.id === snapId && semver.satisfies(snap.version, snapVersion)
      );
    } catch (e) {
      console.error("Failed to obtain installed snap", e);
      return undefined;
    }
  };

  requestSnap = async (snapId: string, snapVersion: string) => {
    return await this.ethereumWallet.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: { version: snapVersion },
      },
    });
  };

  confimSnapInstalled = async (snapId: string, snapVersion: string) => {
    let installedSnap = await this.getSnap(snapId, snapVersion);
    if (!installedSnap) {
      await this.requestSnap(snapId, snapVersion);
      installedSnap = await this.getSnap(snapId, snapVersion);
    }
    if (!installedSnap) {
      throw new Error({
        message: `Snap with id: ${snapId} not installed`,
        statusCode: 422,
      });
    }
    return installedSnap;
  };

  confirmFoxSnapInstalled = async () => {
    return await this.confimSnapInstalled(this.foxSnapId, this.foxSnapVersion);
  };

  confirmIPFSSyncSnapInstalled = async () => {
    return await this.confimSnapInstalled(
      this.ipfsSnapId,
      this.ipfsSnapVersion
    );
  };

  changeSkin = async (skinId: number, skin: string) => {
    this.foxSprite.play({
      key: `${this.idleKey}-${this.selectedSkin}`,
      repeat: -1,
    });
    let newSkin = "default"
    await this.foxSkin(skinId, skin)
      .then((fox: any) => {
        newSkin = fox.skin
        this.selectedSkin = newSkin;
        this.foxSprite.play({
          key: `${this.idleKey}-${this.selectedSkin}`,
          repeat: -1,
        });
      })
      .then(() => this.foxPersist())
      .catch(console.error);
    return newSkin
  };

  foxFeed = () => {
    this.ethereumWallet
      .request({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.foxSnapId,
          request: {
            method: "feed",
          },
        },
      })
      .then((fox: any) => {
        this.textHunger.text = `${Math.ceil(fox.hunger ?? 0)}`;
      });
  };

  foxPersist = async () => {
    await this.confirmIPFSSyncSnapInstalled();
    return this.ethereumWallet.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.foxSnapId,
        request: {
          method: "persist",
          params: {
            ownerAddress: await this.getUserAddress(),
          },
        },
      },
    });
  };

  foxLoad = async () => {
    await this.confirmIPFSSyncSnapInstalled();
    return await this.ethereumWallet.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.foxSnapId,
        request: {
          method: "load",
          params: {
            ownerAddress: await this.getUserAddress(),
          },
        },
      },
    });
  };

  foxPet = () => {
    this.ethereumWallet
      .request({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.foxSnapId,
          request: {
            method: "pet",
          },
        },
      })
      .then((fox: any) => {
        this.textHappiness.text = `${Math.ceil(fox.happiness ?? 0)}`;
      });
  };

  foxHeal = () => {
    this.ethereumWallet
      .request({
        method: "wallet_invokeSnap",
        params: {
          snapId: this.foxSnapId,
          request: {
            method: "heal",
          },
        },
      })
      .then((fox: any) => {
        this.textHealth.text = `${Math.ceil(fox.health ?? 0)}`;
      });
  };

  foxAsk = () => {
    this.ethereumWallet.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.foxSnapId,
        request: {
          method: "ask",
        },
      },
    });
  };

  foxClean = () => {
    return this.ethereumWallet.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.foxSnapId,
        request: {
          method: "clean",
        },
      },
    });
  };

  foxSay = () => {
    const rSay = Math.floor(Math.random() * this.tips.length);
    this.ethereumWallet.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.foxSnapId,
        request: {
          method: "speak",
          params: {
            message: this.tips[rSay],
          },
        },
      },
    });
  };

  foxAdopt = () => {
    return this.ethereumWallet.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.foxSnapId,
        request: {
          method: "hello",
        },
      },
    });
  };

  foxSkin = (skinId: number, skin: string) => {
    return this.ethereumWallet.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: this.foxSnapId,
        request: {
          method: "skin",
          params: {
            skinId,
            skin,
          },
        },
      },
    });
  };

  getUserAddress = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return await signer.getAddress()
  }
}
