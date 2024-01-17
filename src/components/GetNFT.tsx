import ReCAPTCHA from "react-google-recaptcha";
import { FormEvent, useState } from "react";
import { Errors } from "@/utils/errors";
import { useAccount } from 'wagmi'

type GetNFTProps = {
  getCurrentLevel: () => Promise<number | void>
}

export function GetNFT({ getCurrentLevel }: GetNFTProps) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    setError(null)

    const sendNft = async () => {
      setIsLoading(true)
      const currentLevel = await getCurrentLevel()

      if (!currentLevel || currentLevel <= 0) {
        setError('Something went wrong, try again.')
        setIsLoading(false)
        return
      }

      const body = {
        "g-recaptcha-response": captcha,
        level: currentLevel,
        userAddress: address
      }

      const response = await fetch('api/nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const responseData = await response.json()

      if (response.status !== 200) {
        if (responseData.message === Errors.CAPTCHA_FAILED) {
          setError('Captcha failed, try again.')
        } else {
          setError('Something went wrong, try again.')
        }
        setIsLoading(false)
        return
      }

      setTxHash(responseData.txHash)
      setIsLoading(false)
    }

    sendNft()

  }

  const onOk = () => {
    const sendNftDiv = document.getElementById('GetNFT')!;
    sendNftDiv.style.display = 'none';
  }

  return (
    <form
      id="GetNFT"
      style={{ display: 'none' }}
      onSubmit={onSubmit}
      className="absolute top-1/3 left-28 p-1 py-4 w-[600px] bg-[#fed5fb] border-2 border-[#9f1bf5] flex flex-col justify-center items-center space-y-4"
    >
      <h1 className="text-xl font-bold">Congratulations for completing this level! Click the button below to get your NFT skin.</h1>
      {isLoading ? (
        <div className="min-h-[160px] flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <>
          {
            error && <p className="text-red-500">{error}</p>
          }
          {
            txHash ? (
              <>
                <p className="text-base">
                  Your skin is on the way, follow the transaction status <a className="text-blue-500" href={`${process.env.NEXT_PUBLIC_LINEA_BLOCK_EXPLORER_URL}/tx/${txHash}`}>here</a>.
                </p>
                <button id="autosave" className="button mt-4" onClick={onOk}>
                  Ok
                </button>
              </>
            ) : (
              <>
                <ReCAPTCHA
                  className="flex justify-center"
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={setCaptcha}
                />
                <button id="autosave" type="submit" className={`button mt-4 ${!captcha && "hover:cursor-not-allowed"}`} disabled={!captcha}>
                  GET NFT
                </button>
              </>
            )
          }
        </>
      )}
    </form>
  )
}