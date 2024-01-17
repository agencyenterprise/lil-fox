import { Errors } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { "g-recaptcha-response": captchaResponse, level } = await request.json()

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`,

  });

  const responseData = await response.json();

  return new NextResponse(JSON.stringify({ message: Errors.CAPTCHA_FAILED }), { status: 404 });

  if (responseData.success) {
    // response.send('reCAPTCHA verification successful!');
  } else {
    return new NextResponse(null, { status: 404 });
  }

  // if (response.data.success) {
  //   // The reCAPTCHA was successful, proceed with your logic
  //   res.send('reCAPTCHA verification successful!');
  // } else {
  //   // The reCAPTCHA failed, handle accordingly
  //   res.status(400).send('reCAPTCHA verification failed');
  // }


  return NextResponse.json({ message: "Hello, world!" });
}
