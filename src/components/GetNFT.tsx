import ReCAPTCHA from "react-google-recaptcha";
import { FormEvent, useState } from "react";

export function GetNFT() {
  const [captcha, setCaptcha] = useState<string | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    console.log(captcha)

    fetch('api/nft')
  }

  return (
    <form
      id="GetNFT"
      style={{ display: 'none' }}
      onSubmit={onSubmit}
    >
      <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} onChange={setCaptcha} />
      <button type="submit">Enviar</button>
    </form>
  )
}