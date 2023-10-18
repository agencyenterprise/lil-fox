## Overview

The game is using nextjs as a wrapper and Phaser as the game engine. Currently, the game has only one scene and its where all metamask wallet requests are located.

When user clicks the start button of the game, it should start up with a default fox and then load the fox on the metamask.

The `old/` folder contains the OG lil fox which the project was based on.

## Getting Started

First, install and run the development server:

```bash
yarn install

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

There is only the main page `app/page.tsx`. That page checks if user has Flask from metamask, in case it has, it shows the fox.exe to start up the game on browser.


## Deployment
This project is currently deployed in railway and the url for the deployed build is https://lil-fox-production.up.railway.app/

It should deploy at each update on main branch.
