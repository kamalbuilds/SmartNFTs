# SmartNFTs

Lets Users bring life to their Brand NFTs which contain your assets along with a Dynamic Loyalty NFT which increases its level  using chainlink Automation and CCIP as the user purchases more product of that brand. 

Users NFT now has the power to take action like Investing in Uniswap Pools.

🚀 Connect to 9 chains that we support seamlessly with the best UX.


TBA - https://mumbai.polygonscan.com/address/0xb983f7e345fe5493d8abb63ae1ab52ec372b4f19

Loyalty Membership NFTs 1 of each brand - https://mumbai.polygonscan.com/address/0xE1822311D285d78EE98f5bD0f2edcF56fb7F1D29

Brand ProductNFT Collection - 0xBd491b4321DbE318522Ab3266590883c9F055200

![ERC-6551 Structure](/smartnfts/public/image.png)
![Alt text](/smartnfts/public/registery.png)

# CCIP Liquidity Manager Feature lets you manage your Postions across Multiple Dexes on different Chains.

User can monitor his positions on different dexes like Aave , Uniswap 

Chainlink automation 

https://docs.chain.link/ccip/supported-networks/v1_2_0/testnet

https://sepolia.etherscan.io/address/0xbaefaa39a6b5913f8cfda26e3d58b5310a8df511#code - Mock Vault
https://mumbai.polygonscan.com/address/0xb79cc8e557ceab885c943e69f1bc1cd8259bb871#code - Mock Lending 

npx hardhat deploy-lpsc --router 0x0bf3de8c5d3e8a2b34d2beeb17abfcebaf363a59 --vault 0xbaefaa39a6b5913f8cfda26e3d58b5310a8df511

https://sepolia.etherscan.io/address/0x340900f5b46a726fe1df567dbdfb632279765cc4 - LPSC


// npx hardhat deploy-monitor-mock-lending
// --min-health-factor 50
// --router 0x1035cabc275068e0f4b745a29cedf38e13af41b1
// --link 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
// --lending-address 0xb79cc8e557ceab885c943e69f1bc1cd8259bb871
// --token-address 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
// --on-behalf-of 0x0439427C42a099E7E362D86e2Bbe1eA27300f6Cb
// --lpsc 0x340900f5b46a726fe1df567dbdfb632279765cc4
// --liquidation-chain-selector 16015286601757825753 (sepolia)

https://mumbai.polygonscan.com/address/0x8cc2862048d51c97a999ab7297c0bafb5bec68eb MonitorMockLending 

https://mumbai.polygonscan.com/address/0x1035cabc275068e0f4b745a29cedf38e13af41b1 - CCIP Router Address


Features

Brands can issue NFTs on their items with a QR Code and now users would be able to pay and purchase those items.

Our main usecase- Easier onboarding for new users. Imagine buying some merch from a shop and getting an associated NFT with it. Any future rewards or benefits can be airdropped straight into the wallet associated with that NFT. To self-custody, user can just move the top-level NFT from the merch shop's website into a wallet under their control, and all contained assets move with it.

Prime Future usecase :- Building onchain quest like buy 3 products in a week , and when user completes a quest his loyalty nft points get automatically updated using chainlink automation.

Integrations aimed

1. Chainlink Automation and CCIP
 We are using Chainlink CCIP to get the product NFTs on any chain the user wants.

2. 1inch Fusion Swaps via Token Bound Accounts

Execute Swaps using Fusion SDK and API and then deposit in UniswapV3 Pools.

3. Airstack 
For querying ERC-6551 related things

4. Push for Chat 

5. XDC and Submit to Alliance for Best Startup Idea

6. Project live on Scroll, Mantle , Celo , PolygonZKevm , Arbitrium and X1 OKX Testnet Chain
   
## Mantle
ERC6551Registery - https://explorer.testnet.mantle.xyz/address/0xc220Fe2cAFfcAF2c333E6Ba5C12E03B28D2fe6f6/contracts#address-tabs

ERC6551Account - https://explorer.testnet.mantle.xyz/address/0x31Db34373163A1DAAb638f813E96c8315e6078B9/contracts#address-tabs

CreateAccount Proof - https://explorer.testnet.mantle.xyz/tx/0x213d78d0fde950ae126ba7c770dfbdfb95146672752648bd460d6393bf55cc26

TBA Impl - https://explorer.testnet.mantle.xyz/address/0xe551c18b1dfC8A2c21B7B3df932a64Aa07018c11/transactions#address-tabs

## Polygonzkevm

Registery - https://testnet-zkevm.polygonscan.com/address/0x5c729acd895eaa2b6a415219af6fb49b2ff7f5c3#code

Account - https://testnet-zkevm.polygonscan.com/address/0x611c9D2e67BCA09f4208b7b6ce27fAcBc4A5eE6D

TBA- https://thirdweb.com/polygon-zkevm-testnet/0xbEA03c2A49aE2D9671900efeFdC604304f5CA957

Rose Diamond Collection - https://testnet-zkevm.polygonscan.com/address/0x6B8195Cd326B27a88Bc1D7Dc4220a29A7d96F237

## Base
Gold Earings https://base-goerli.blockscout.com/address/0x75DE6d2dE507a8572413cfBa2cD470418eF8c162

TBA https://base-goerli.blockscout.com/address/0x8d72887163f8bD8A65649Ef4af37dcc21500e5A1

## Scroll 

Registery - https://sepolia.scrollscan.com/address/0xdf366b8fb6553e6f5826ee6195cb9330a34442c1

Account - https://sepolia.scrollscan.com/address/0xcb28933eed27d02ab86f66668150187807aa47e8

TBA - https://sepolia.scrollscan.com/address/0xa0c5d2d665869641e86c3d5fe3c9db4fff18f67b

## OKX X1 Chain 

ERC6551Account - https://www.oklink.com/x1-test/tx/0x435fcd979b46de33934839df1bf0d72ec61d7580cfb636d8aeecd4cdb0735841
ERC6551REGISTRY - https://www.oklink.com/x1-test/tx/0x5F3eC562AD05A1395b43Fbf0098bB34ada4846c0
TBA - https://www.oklink.com/x1-test/address/0x9276A0ea8897A25c2f59705F6A7da9cAcC320b47


## AA related

1. Best use of Account Abstraction and Base Paymaster ⸺ $4,000

User can send transaction by paying USDC as gas fee

Utilize a smart contract wallet to further improve UX
Utilize the new Base Paymaster to allow for free end user transactions

User can send transaction by paying USDC as gas fee

2. Best use of OKX  Best use of Account Abstraction

Pages

npx prisma db push

mongodb+srv://kamal:mMtmf04G6O1DHNjZ@cluster0.btoeo63.mongodb.net/qrproductnft?retryWrites=true&w=majority

For testing the qr code claiming nfts on store go to - /claim?id=clpo508e80000iw3dysdf4dbj
