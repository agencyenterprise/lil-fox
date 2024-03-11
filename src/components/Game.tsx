import { useRef, useState, useEffect } from "react";
import config from "@/config/index";
import { BigNumber, ContractInterface, ethers } from "ethers";
import Image from "next/image";
import { useAccount } from 'wagmi'
import { NotInitiatedGame } from "./NotInitiatedGame";
import { GetNFT } from "./GetNFT";

const tokenIdToSkin = new Map<number | string, number | string>([
  [0, "blue"],
  ["blue", 0],
  // [1, "flask"],
  // ["flask", 1],
  [2, "kumamon"],
  ["kumamon", 2],
  [3, "sunglasses"],
  ["sunglasses", 3]
]);

export function Game() {
  let gameRef = useRef<Phaser.Game | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [ownedSkins, setOwnedSkins] = useState<string[]>([]);
  const { address } = useAccount()

  useEffect(() => {
    setUserSkins()
  }, [address])


  const setUserSkins = async () => {
    if (!address) return
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
      const gameScene = gameRef.current?.scene.scenes[1] as typeof FoxGame;
      gameScene.setAutosave();
    }
  };

  const closeGame = () => {
    gameRef.current?.destroy(true, false);
  };

  const changeSkin = async (skin: string) => {
    if (typeof window !== "undefined") {
      const FoxGame = require("@/scenes").FoxGame;
      const gameScene = gameRef.current?.scene.scenes[1] as typeof FoxGame;
      await gameScene.changeSkin(skin);
    }
  };

  const getCurrentLevel = async (): Promise<number | void> => {
    if (typeof window !== "undefined") {
      const FoxGame = require("@/scenes").FoxGame;
      const gameScene = gameRef.current?.scene.scenes[1] as typeof FoxGame;
      if (!gameScene) return
      return await gameScene.getCurrentLevel();
    }
    return -1
  }

  return (
    <div id="phaser-container" >
      {!isGameStarted && (
        <NotInitiatedGame gameRef={gameRef} setIsGameStarted={setIsGameStarted} />
      )}
      <GetNFT getCurrentLevel={getCurrentLevel} />

      {/* <div className="window-style w-fit h-[664px] absolute -right-[250px] top-0 p-2">
        <div className="flex box-border w-full h-12 p-1 bg-[#fed5fb] items-center border-2 border-[#9f1bf5] header">
          <h1 id="title" className="text-2xl font-bold px-2">
            Choose Skin
          </h1>
        </div>
        {ownedSkins.map((skin) => (
          <button
            key={skin}
            id={skin}
            className="skin-button button-inactive flex flex-col gap-y-4 mt-4 items-center justify-center w-full"
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
      </div> */}
    </div>
  )
}