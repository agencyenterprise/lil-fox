import ReCAPTCHA from "react-google-recaptcha";
import { FormEvent, useState } from "react";
import { Errors } from "@/utils/errors";

type GetNFTProps = {
  getCurrentLevel: () => Promise<number | void>
}

export function GetNFT({ getCurrentLevel }: GetNFTProps) {
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    console.log(captcha)

    const send = async () => {
      const currentLevel = await getCurrentLevel()      
      const body = {
        "g-recaptcha-response": captcha,
        level: currentLevel
      }
  
      const response = await fetch('api/nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const responseData = await response.json()

      if(response.status !== 200) {
        console.log(responseData.message)
        if (responseData.message === Errors.CAPTCHA_FAILED) {
          setError('Captcha failed try again')
        }
        return
      }


      
    }
    
    send()
  }

  return (
    <form
      id="GetNFT"
      style={{ display: 'none' }}
      onSubmit={onSubmit}
      className="absolute top-1/3 left-28 p-1 py-4 w-[600px] bg-[#fed5fb] border-2 border-[#9f1bf5] flex flex-col justify-center items-center space-y-4"
    >
      <h1 className="text-xl font-bold">Congratulations for completing this level! Click the button below to get your get your NFT skin.</h1>
      <ReCAPTCHA
        className="flex justify-center"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={setCaptcha}
      />
      <button id="autosave" type="submit" className="button mt-4">
        GET NFT
      </button>
    </form>
  )
}