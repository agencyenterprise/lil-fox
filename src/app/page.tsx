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
  const [hasMetamask, setHasMetamask] = useState(false);

  useEffect(() => {
    getMetamask().then((result) => {
      setHasMetamask(result);
    });
  });

  const getMetamask = async () => {
    const provider = window.ethereum;

    try {
      await provider?.request({
        method: "web3_clientVersion",
      });

      return provider
    } catch {
      return false;
    }
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <main className="flex items-center h-screen justify-center ">
        {hasMetamask && (
          <Game />
        )}
      </main>
    </WagmiConfig>
  );
}
