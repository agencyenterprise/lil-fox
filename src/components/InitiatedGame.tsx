import { MutableRefObject, useEffect, useState } from "react";
import { ConnectWalletComponent } from "./ConnectWalletComponent";
import config from "@/config/index";
import { BigNumber, ContractInterface, ethers } from "ethers";
import Image from "next/image";
import { useAccount } from 'wagmi'

type InitiatedGameProps = {
  setInitiated: (initiated: boolean) => void;
  game: MutableRefObject<Phaser.Game | null>;
}

const tokenIdToSkin = new Map<number | string, number | string>([
  [0, "blue"],
  ["blue", 0],
]);

export function InitiatedGame({ setInitiated, game }: InitiatedGameProps) {
  const [ownedSkins, setOwnedSkins] = useState<string[]>([]);
  const { address } = useAccount()

  useEffect(() => {
    reload()
    setUserSkins()
    if (typeof window !== "undefined" && game.current) {
      const FoxGame = require("@/scenes").FoxGame;
      const gameScene = game.current?.scene.scenes[0] as typeof FoxGame;
      gameScene.initializeState();
    }
  }, [address])

  const setUserSkins = async () => {
    const erc1155Interface: ContractInterface = [
      'function balanceOf(address account, uint256 id) external view returns (uint256)',
      'function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory)'
    ]

    const provider = new ethers.providers.JsonRpcProvider(config.lineaRpcUrl)
    const lilFoxSkinsContract = new ethers.Contract(config.foxSkinContractAddress, erc1155Interface, provider)

    const tokenIdsArray = Array.from({ length: config.maxNftSkinId + 1 }, (_, i) => i);
    const addressesArray = Array(config.maxNftSkinId + 1).fill(address)

    const balanceOfBatch = await lilFoxSkinsContract.balanceOfBatch(addressesArray, tokenIdsArray)
    const ownedSkins: string[] = ["default"]

    const entries: [string, BigNumber][] = Object.entries(balanceOfBatch);
    entries.forEach(([key, value]) => {
      if (value.gt(0)) {
        const skin = tokenIdToSkin.get(Number(key))
        if (!skin) return
        ownedSkins.push(String(skin))
      }
    })
    setOwnedSkins(ownedSkins)
  }

  const autosave = () => {
    if (typeof window !== "undefined") {
      const FoxGame = require("@/scenes").FoxGame;
      const gameScene = game.current?.scene.scenes[0] as typeof FoxGame;
      gameScene.setAutosave();
    }
  };

  const closeGame = () => {
    game.current?.destroy(true, false);
    setInitiated(false);
  };

  const changeSkin = async (skin: string) => {
    if (typeof window !== "undefined") {
      const FoxGame = require("@/scenes").FoxGame;
      const gameScene = game.current?.scene.scenes[0] as typeof FoxGame;
      const skinId = tokenIdToSkin.get(skin)
      await gameScene.changeSkin(skinId, skin);
    }
  };

  const reload = async () => {
    if (typeof window !== "undefined") {
      const FoxGame = require("@/scenes").FoxGame;
      const gameScene = game.current?.scene.scenes[0] as typeof FoxGame;
      if (!gameScene) return
      await gameScene.foxLoad();
    }
  };

  return (
    <div className="flex text-center w-[814px] pb-1 window-style absolute top-[50%] left-[50%] mt-[-334px] ml-[-407px] justify-center items-center flex-row ">
      <div
        id="pic"
        className="h-64 w-64 absolute top-0 -left-72 text-center pb-1 window-style justify-center items-center flex-row opacity-0"
      ></div>
      <div className="flex flex-col w-full p-1">
        <ConnectWalletComponent />
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


      <div className="window-style w-fit h-[664px] absolute -right-[250px] top-0 p-2">
        <div className="flex box-border w-full h-12 p-1 bg-[#fed5fb] items-center border-2 border-[#9f1bf5] header">
          <h1 id="title" className="text-2xl font-bold px-2">
            Choose Skin
          </h1>
        </div>
        {ownedSkins.map((skin) => (
          <button
            key={skin}
            id={skin}
            className="skin-button button-inactive flex flex-col gap-y-4 mt-4  items-center justify-center w-full"
            onClick={() => changeSkin(skin)}
          >
            <Image
              src={`/skin-icons/fox-${skin}-skin.png`}
              width="48"
              height="48"
              alt="fox icon"
            />
          </button>
        ))}
      </div>
    </div>
  )
}