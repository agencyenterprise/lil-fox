"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function Home() {
  const [hasFlask, setHasFlask] = useState(false);
  const [initiated, setInitiated] = useState(false);
  let game = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    isFlask().then((result) => {
      setHasFlask(result);
    });
  });

  const isFlask = async () => {
    const provider = window.ethereum;

    try {
      const clientVersion = await provider?.request({
        method: "web3_clientVersion",
      });
      console.debug({ clientVersion });

      // supports MetaMask > v11 or Flask
      const isMetamaskDetected =
        clientVersion.split("/v")[1].replace("v", "").split(".")[0] >= 11 ||
        clientVersion?.includes("flask");

      return provider && isMetamaskDetected;
    } catch {
      return false;
    }
  };

  const startGame = () => {
    setInitiated(true);
    // deploy one cycle so that the game can be started on the correct tag
    if (typeof window !== "undefined") {
      const FoxGame = require("@/scenes").FoxGame;
      setTimeout(() => {
        game.current = new Phaser.Game({
          type: Phaser.AUTO,
          parent: "phaser-container",
          backgroundColor: "rgba(129,186,68,1)",
          // scale: {
          //   mode: Phaser.Scale.ScaleModes.RESIZE,
          //   width: window.innerWidth,
          //   height: window.innerHeight,
          // },
          width: 800,
          height: 600,
          pixelArt: true,
          physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0 },
              debug: true,
            },
          },
          scene: FoxGame,
        });
      });
    }
  };

  const closeGame = () => {
    game.current?.destroy(true, false);
    setInitiated(false);
  };

  const autosave = () => {
    if (typeof window !== "undefined") {
      const FoxGame = require("@/scenes").FoxGame;
      const gameScene = game.current?.scene.scenes[0] as typeof FoxGame;
      gameScene.setAutosave();
    }
  };

  return (
    <main className="flex items-center min-h-screen justify-center ">
      {hasFlask && !initiated && (
        <button id="icon" onClick={startGame}>
          <Image src="/fox.png" width="48" height="48" alt="fox icon" />
          <div>Fox.exe</div>
        </button>
      )}

      {!hasFlask && !initiated && (
        <a
          id="flask"
          className="flex flex-col absolute mx-auto my-auto justify-center items-center text-center"
          href="https://metamask.io"
          target="_blank"
        >
          <Image src="/ie.png" width="48" height="48" alt="flask icon" />
          <p>Flask Required</p>
          <p>Get MetaMask</p>
        </a>
      )}
      {initiated && (
        <div className="flex text-center w-[814px] pb-1 border-2 border-r-[#9f1bf5] border-b-[#9f1bf5] border-t-white border-l-white bg-[#6effeb] absolute top-[50%] left-[50%] mt-[-334px] ml-[-407px] justify-center items-center flex-row shadow-frame">
          <div
            id="pic"
            className="h-64 w-64 absolute top-0 -left-72 text-center pb-1 border-2 border-r-[#9f1bf5] border-b-[#9f1bf5] border-t-white border-l-white bg-[#6effeb] justify-center items-center flex-row shadow-frame opacity-0"
          ></div>
          <div className="flex flex-col w-full justify-center items-center">
            <div className="flex m-1 mx-4 justify-between box-border w-[800px] h-12 p-1 bg-[#fed5fb] items-center border-2 border-[#9f1bf5] header">
              <h1 id="title" className="text-2xl font-bold pl-2">
                Fox.exe
              </h1>
              <div className="flex items-center">
                <button id="autosave" className="button" onClick={autosave}>
                  autosave
                </button>
                <button id="close" className="button" onClick={closeGame}>
                  X
                </button>
              </div>
            </div>
            <div id="phaser-container" className="h-[600px] w-[800px]"></div>
          </div>
        </div>
      )}
    </main>
  );
}
