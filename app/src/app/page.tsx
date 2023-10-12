"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("ping");
  });
  return (
    <main>
      <div id="icon">
        <Image src="/fox.png" width="48" height="48" alt="fox icon" />
        <div>Fox.exe</div>
      </div>

      <div id="flask" className="hidden">
        <Image src="/ie.png" width="48" height="48" alt="flask icon" />
        <div>MetaMask v11 or Flask Required</div>
        <div>Get MetaMask</div>
      </div>

      <div id="main" className="frame">
        <div id="pic"></div>
        <div className="header">
          <h1 id="title">Fox.exe</h1>
          <button id="autosave" className="autosave">
            autosave
          </button>
          <button id="close" className="close">
            X
          </button>
        </div>
        <div className="body">
          <div id="game"></div>
        </div>
      </div>
    </main>
  );
}
