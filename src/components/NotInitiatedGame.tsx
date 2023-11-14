import { useNetwork, useAccount, useConnect, useSwitchNetwork } from 'wagmi'
import Image from "next/image";
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { lineaTestnet } from '@wagmi/core/chains'
import { MutableRefObject } from 'react';

type NotInitiatedGameProps = {
  setInitiated: (initiated: boolean) => void;
  game: MutableRefObject<Phaser.Game | null>;
}

export function NotInitiatedGame({ setInitiated, game }: NotInitiatedGameProps) {
  const { connect } = useConnect()
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  const { switchNetwork } = useSwitchNetwork()

  const connector = new MetaMaskConnector({
    chains: [lineaTestnet],
  })

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
          <>
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
              className='border-2 p-2 mt-2 mb-2 font-bold bg-blue-500'
            >
              Connect With Metamask
            </button>
          </>
        )
      }
    </div>
  )
}