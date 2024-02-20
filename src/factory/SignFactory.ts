import EnterLevelSign from "@/types/EnterLevelSign"
import Sign from "@/types/Sign"

export enum SignType {
  ENTER_LEVEL_SIGN_LEVEL_1 = 'ENTER_LEVEL_SIGN_LEVEL_1',
  ENTER_LEVEL_SIGN_LEVEL_2 = 'ENTER_LEVEL_SIGN_LEVEL_2',
  FINISH_LEVEL_SIGN_LEVEL_1 = 'FINISH_LEVEL_SIGN_LEVEL_1',
  FINISH_LEVEL_SIGN_LEVEL_2 = 'FINISH_LEVEL_SIGN_LEVEL_2',
}

export const createSign = (x: number, y: number, signType: SignType): Sign => {
  console.log('Creating sign', signType)
  if (signType === SignType.ENTER_LEVEL_SIGN_LEVEL_1) {
    return new EnterLevelSign(x, y, signMessages[signType], 1)
  } else {
    return new EnterLevelSign(x, y, signMessages[signType], 2)
  }
}

const signMessages = {
  [SignType.ENTER_LEVEL_SIGN_LEVEL_1]: [
    "This village has been raided by Phising Lizards, sneak into it dodging the lizards and get to the end of the village to acquire the knowledge of how to defeat them."
  ],
  [SignType.ENTER_LEVEL_SIGN_LEVEL_2]: [
    "The castle has been dominated by Gas fees archers, they are blocking the way and extorting who tries to get to the palace.",
    "Try to get to the palace by avoiding the arrows to find out how to defeat them."
  ],
  [SignType.FINISH_LEVEL_SIGN_LEVEL_1]: [
    "In the interconnected world of blockchain and cryptocurrencies, safeguarding your digital assets and personal information is paramount. Phishing attacks, deceptive attempts to compromise sensitive data, are prevalent threats in both realms. Here are essential strategies to protect yourself against phishing attacks:\n\nVerify Sender Information:\n\nBefore clicking on any links or providing information, verify the sender's email address or contact information. Legitimate organizations use official domains, and any deviation should raise suspicion.\n\n",
    "Check for Secure Websites:\n\nLook for \"https://\" in the website URL. Secure websites encrypt your data during transmission, making it more challenging for attackers to intercept and misuse your information.\n\nVerify Wallet Addresses:\n\nAlways double-check wallet addresses before initiating any cryptocurrency transactions. Confirm that the address is correct and matches the intended recipient. Cryptocurrency transactions are irreversible, so accuracy is crucial.\n\n",
    "Use Hardware Wallets:\n\nConsider storing your cryptocurrencies in hardware wallets. These physical devices provide an extra layer of security by keeping your private keys offline, making them less susceptible to online phishing attempts.\n\nBe Wary of Urgent Requests:\n\nPhishers create a sense of urgency to pressure individuals into quick actions. Be skeptical of emails or messages that demand immediate responses or threaten consequences.\n\n",
    "Beware of Social Engineering:\n\nPhishers often employ social engineering tactics, creating fake social media profiles or websites to impersonate reputable projects or individuals. Be cautious when interacting online and verify the authenticity of accounts and information.\n\nBeware of Urgent Requests:\n\nPhishers create a sense of urgency to pressure individuals into quick actions. Be skeptical of emails or messages that demand immediate responses or threaten consequences.\n\nRemember, the decentralized nature of blockchain provides security, but individuals must also take responsibility for their own safety in the crypto space.\n\n",
    "Based on the that, what is a recommended practice to secure your cryptocurrency transactions and protect against phishing attacks?\n\n1) Double-check and verify wallet addresses before initiating transactions.\n\n2) Share your private keys with trusted friends for backup.\n\n3) Ignoring all emails from unknown senders.\n\n4) Responding immediately to urgent requests in emails."
  ],
  [SignType.FINISH_LEVEL_SIGN_LEVEL_2]: [
    "In the world of blockchain and cryptocurrencies, gas fees play a crucial role in facilitating transactions on decentralized networks. Gas fees are transaction fees paid for computational work in processing and validating transactions. Understanding and managing gas fees is essential for efficient and cost-effective interactions in the crypto realm.\n\nGas fees are determined by network demand and are crucial for prioritizing transactions. During times of high demand, gas fees tend to rise, reflecting the cost of processing transactions quickly. Conversely, in periods of lower demand, gas fees may decrease.\n\nIt's important to note that gas fees vary across different blockchain networks. For example, Ethereum's gas fees can be influenced by factors such as network congestion and the complexity of smart contracts.\n\n",
    "To optimize your experience and minimize costs, consider the following tips:\n\nGas Price: Gas prices are denoted in cryptocurrency (e.g., Gwei in Ethereum). Users can set the gas price they're willing to pay for a transaction. Higher gas prices increase the likelihood of quicker transaction confirmations.\n\nGas Limit: The gas limit represents the maximum amount of computational work a transaction can perform. Setting an appropriate gas limit ensures transactions are processed successfully without running out of gas.\n\nTransaction Timing: Monitoring network activity helps in choosing the right time to execute transactions. Performing transactions during periods of lower network congestion can result in lower gas fees.\n\n",
    "With that in mind, why do gas fees tend to rise during periods of high network demand, and how can users optimize their transaction timing to minimize gas fees?\n\n1) Gas fees rise due to increased security measures, and users should perform transactions during peak times for quicker confirmations.\n\n2) Gas fees rise because more users are competing for limited network resources, and users should perform transactions during periods of lower network congestion.\n\n3) Gas fees rise as a result of network maintenance, and users should perform transactions when the network is busiest.\n\n4) Gas fees rise due to decreased transaction complexity, and users should perform transactions when the gas price is at its lowest.\n\nChoose the correct option that explains the relationship between network demand and gas fees, along with an effective strategy for transaction timing."
  ]
}