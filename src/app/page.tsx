"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { lineaTestnet } from '@wagmi/core/chains'
import { Game } from "@/components/Game";

declare global {
  interface Window {
    ethereum: any;
  }
}

const { publicClient, webSocketPublicClient } = configureChains(
  [lineaTestnet],
  [publicProvider()],
)

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

export default function Home() {
  const [hasFlask, setHasFlask] = useState(false);

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

  return (
    <WagmiConfig config={wagmiConfig}>
      <main className="flex items-center h-screen justify-center ">
        {hasFlask && (
          <Game />
        )}

        {!hasFlask && (
          <>
            <a
              id="flask"
              className="flex flex-col mx-auto my-auto justify-center items-center text-center"
              href="https://metamask.io"
              target="_blank"
            >
              <Image src="/ie.png" width="48" height="48" alt="flask icon" />
              <p>Flask Required</p>
              <p>Get MetaMask</p>
            </a>
          </>
        )}
      </main>
    </WagmiConfig>
  );
}
