"use client"

import { useNetwork, useAccount, useConnect, useSwitchNetwork } from 'wagmi'
import Image from "next/image";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { lineaTestnet } from '@wagmi/core/chains'
import initializeWorld from '@/InitializeWorld';
import { getItems } from '@/prefabs/Item';
import getPlayer from '@/prefabs/Player';

type NotInitiatedGameProps = {
  setIsGameStarted: (started: boolean) => void
  gameRef: any
}

export const world = initializeWorld()
export const playerEntity = getPlayer();

export function NotInitiatedGame({ setIsGameStarted, gameRef }: NotInitiatedGameProps) {
  const { connect } = useConnect()
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  const { switchNetwork } = useSwitchNetwork()

  const connector = new MetaMaskConnector({
    chains: [lineaTestnet],
  })

  const startGame = () => {
    async function initPhaser() {
      const Phaser = await import("phaser")

      const { default: Preloader } = await import("../scenes/Preloader")
      const { default: FoxGame } = await import("../scenes/FoxGame")
      const { default: MarioScene } = await import("../scenes/MarioScene")
      const { default: GameUI } = await import("../scenes/GameUI")
      const { default: QuizScene } = await import("../scenes/QuizScene")
      const { default: GrandpaScene } = await import("../scenes/GrandpaScene")

      const { default: RexUIPlugin } = await import("phaser3-rex-plugins/templates/ui/ui-plugin.js");
      const { default: DragPlugin } = await import("phaser3-rex-plugins/plugins/drag-plugin");

      gameRef.current = new Phaser.Game({
        parent: "phaser-container",
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [Preloader, GameUI, GrandpaScene, FoxGame, MarioScene, QuizScene],
        scale: {
          zoom: 1,
        },
        pixelArt: true,
        plugins: {
          global: [
            {
              key: "dragPlugin",
              plugin: DragPlugin,
              start: true,
            },
          ],
          scene: [
            {
              key: "rexUI",
              plugin: RexUIPlugin,
              mapping: "rexUI",
            },
          ],
        },
      });

      const items = getItems()

      setIsGameStarted(true);
    }

    initPhaser()
  }

  return (
    <div>
      {isConnected ? (
        chain?.id !== 59140 ? (
          <>
            <button disabled={!switchNetwork} onClick={() => switchNetwork?.(59140)}>
              Switch to Linea network
            </button> 
          </>
        ) : (
          <div>
            <button id="icon" onClick={startGame}>
              <Image src="/fox.png" width="48" height="48" alt="fox icon" />
              <div>Fox.exe</div>
            </button>
          </div>
        )
      ) : (
        <div>
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
            className="border-2 p-2 font-bold bg-blue-500"
          >
            Connect With Metamask
          </button>
        </div>
      )}
    </div>
  )
}
