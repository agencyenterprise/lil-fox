import { Errors } from "@/utils/errors";
import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { "g-recaptcha-response": captchaResponse, level, userAddress } = await request.json()

  if (!isCaptchaValid(captchaResponse)) {
    return new NextResponse(JSON.stringify({ message: Errors.CAPTCHA_FAILED }), { status: 404 });
  }

  const txHash = await sendNft(userAddress, level)

  return NextResponse.json({ txHash });
}

const isCaptchaValid = async (captchaResponse: string): Promise<boolean> => {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`,
  });

  const responseData = await response.json();
  return responseData.success
}

const sendNft = async (to: string, level: number): Promise<string> => {
  const mintFunctionInterface = new ethers.utils.Interface(["function mint(address,uint256,uint256,bytes)"]);

  const provider = new ethers.providers.JsonRpcProvider(process.env.LINEA_RPC_URL)
  const wallet = new ethers.Wallet(process.env.CONTRACT_OWNER_PRIVATE_KEY!, provider);
  const skinsContract = new ethers.Contract(process.env.LIL_FOX_SKINS_CONTRACT_ADDRESS!, mintFunctionInterface, wallet);

  const tx = await skinsContract.mint(to, level, 1, "0x");
  return tx.hash
}
