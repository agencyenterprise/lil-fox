import { useAccount, useConnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { lineaTestnet } from '@wagmi/core/chains'


export function ConnectWalletComponent() {
  const { connect } = useConnect()
  const { address, isConnected } = useAccount()

  const connector = new MetaMaskConnector({
    chains: [lineaTestnet],
  })

  return (
    <div className='flex'>
      {
        isConnected ? (
          <div>Connected with: {address}</div>
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