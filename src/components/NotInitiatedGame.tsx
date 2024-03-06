"use client";

import { useNetwork, useAccount, useConnect, useSwitchNetwork } from 'wagmi'
import Image from "next/image";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { lineaTestnet } from '@wagmi/core/chains'

type NotInitiatedGameProps = {
  setIsGameStarted: (started: boolean) => void;
  gameRef: any
}

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

      gameRef.current = new Phaser.Game({
        parent: 'phaser-container',
        width: window.innerWidth,
        height: window.innerHeight,
        scene: [Preloader, FoxGame, MarioScene, GameUI, QuizScene],
        scale: {
          zoom: 3,
        },
      });
      setIsGameStarted(true);
    }
    initPhaser()
  };

  return (
    <div>
      {
        isConnected ? (
          chain?.id !== 59140 ? (
            <>
              <button
                disabled={!switchNetwork}
                onClick={() => switchNetwork?.(59140)}
              >
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
              className='border-2 p-2 font-bold bg-blue-500'
            >
              Connect With Metamask
            </button>
          </div>
        )
      }
    </div>
  )
}