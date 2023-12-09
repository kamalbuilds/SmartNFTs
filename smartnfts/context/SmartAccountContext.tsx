import { createContext, useMemo } from "react";
import { Hex, TypedDataDefinition, concat, createClient, createPublicClient, encodeFunctionData, hashTypedData, http, parseEther, toBytes } from 'viem'
import { BASE_GOERLI_PAYMASTER_URL } from "../lib/constants";
import { baseGoerli, polygonMumbai } from "viem/chains";
import { privateKeyToSafeSmartAccount, signerToSafeSmartAccount } from "permissionless/accounts"
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { generatePrivateKey, privateKeyToAccount, toAccount } from "viem/accounts";
import { SponsorUserOperationParameters, pimlicoBundlerActions, pimlicoPaymasterActions } from "permissionless/actions/pimlico";
import { UserOperation, bundlerActions, createSmartAccountClient, getSenderAddress } from "permissionless";
import NFTAbi from "../const/NFTAbi.json";
import { ThirdwebSDK } from "@thirdweb-dev/react";

export const SmartAccountContext = createContext({})

const adjustVInSignature = (
    signingMethod: "eth_sign" | "eth_signTypedData",
    signature: string
): Hex => {
    const ETHEREUM_V_VALUES = [0, 1, 27, 28]
    const MIN_VALID_V_VALUE_FOR_SAFE_ECDSA = 27
    let signatureV = parseInt(signature.slice(-2), 16)
    if (!ETHEREUM_V_VALUES.includes(signatureV)) {
        throw new Error("Invalid signature")
    }
    if (signingMethod === "eth_sign") {
        if (signatureV < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA) {
            signatureV += MIN_VALID_V_VALUE_FOR_SAFE_ECDSA
        }
        signatureV += 4
    }
    if (signingMethod === "eth_signTypedData") {
        if (signatureV < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA) {
            signatureV += MIN_VALID_V_VALUE_FOR_SAFE_ECDSA
        }
    }
    return (signature.slice(0, -2) + signatureV.toString(16)) as Hex
}

const SmartAccountContextProvider = ({ children }: any) => {
    const thirdwebSigner = useSigner();
    const address = '0x53296c23C51996F415F903d2d6a98ADe2B958DC8';
    console.log("thirdwebSigner", thirdwebSigner)

    const ownerPrivateKey = `0xec163bb6c451bd478b537fd49c0258b4fd72fe52d67a1e63452e66a68a3b439a`;
    const signer = privateKeyToAccount(ownerPrivateKey)

    const signer_res = toAccount(address);

    console.log("Signer", signer, thirdwebSigner, signer_res);

    const publicClient = createPublicClient({
        // transport: http("https://base-goerli.g.alchemy.com/v2/CO_noBqhVqsoYj9lRQ7ThBs7mjhlgtu3"),
        transport: http("https://polygon-mumbai.g.alchemy.com/v2/eoLi0hkG_t_JgHwf3wWhw62Gx0OnF9yf"),
        chain: polygonMumbai
    })


    const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
    const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454"
    const chain = "mumbai" // find the list of chain names on the Pimlico verifying paymaster reference page
    // const apiKey = 'f3ebcd79-cc7f-4889-a044-b92fb8bfa7ee' // REPLACE THIS
    const apiKey = '7c6767f3-0b69-496d-b6f1-db0c6b80718b' // REPLACE THIS

    const bundlerClient = createClient({
        transport: http(`https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`),
        chain: polygonMumbai
    })
        .extend(bundlerActions)
        .extend(pimlicoBundlerActions)


    const paymasterClient = createClient({
        transport: http(`https://api.pimlico.io/v2/${chain}/rpc?apikey=${apiKey}`),
        chain: polygonMumbai
    }).extend(pimlicoPaymasterActions)

    console.log("Public Client", publicClient, paymasterClient);

    const createSafeAccount = async () => {

        const ownerPrivateKey = `0xec163bb6c451bd478b537fd49c0258b4fd72fe52d67a1e63452e66a68a3b439a`;
        const signer = privateKeyToAccount(ownerPrivateKey)

        console.log("Signer", signer, thirdwebSigner);

            const sdk = ThirdwebSDK.fromSigner(thirdwebSigner, 80001 , {
        clientId: process.env.NEXT_PUBLIC_APP_TEMPLATE_CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
// Use secret key if using on the server, get it from dashboard settings. Do NOT expose your secret key to the client-side
      });
        const customSigner = {
            address : await thirdwebSigner?.getAddress() as Hex,
            publicKey: "0x00" as Hex,
            source: 'custom',
            type: 'local' as 'local',
            signMessage: (args: {message: any}) => {
                console.log("here", args);
                return thirdwebSigner?.signMessage(args.message)
            },
            signTypedData: async (typedData: TypedDataDefinition) => {
                console.log("here", typedData);

                // return sdk.wallet.signTypedData();
                return (await sdk.wallet.signTypedData(
                    // @ts-ignore
                    typedData.domain,
                    {
                        [typedData.primaryType]: typedData.types[typedData.primaryType]
                    },
                     typedData.message,
                    
                  )).signature;

                // const messageHash: string = hashTypedData(typedData) || ""

                // return adjustVInSignature(
                //     "eth_sign",
                //     (await thirdwebSigner?.signMessage(messageHash)) || ""
                // )

            }
        }

        const res = await signerToSafeSmartAccount(publicClient, {
            entryPoint: ENTRY_POINT_ADDRESS,
            signer: customSigner,
            safeVersion: "1.4.1",
            saltNonce: 100n,
        })

        console.log("res", res);


        const bundlerClient = createClient({
            transport: http(`https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`),
            chain: polygonMumbai
        })
            .extend(bundlerActions)
            .extend(pimlicoBundlerActions)


        const paymasterClient = createClient({
            transport: http(`https://api.pimlico.io/v2/${chain}/rpc?apikey=${apiKey}`),
            chain: polygonMumbai
        }).extend(pimlicoPaymasterActions);

        function estimateGasResponse (userOp: UserOperation) {
            return fetch("https://paymaster.base.org", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                method: "eth_paymasterAndDataForEstimateGas",
                params: [
                  userOp,
                  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // entrypoint
                  "0x14A33", // chainid in hexadecimal
                ],
              }),
            }).then(response => response.json());
          }

          function userOperationResponse (userOp : UserOperation) {
            return  fetch("https://paymaster.base.org", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: 1,
              jsonrpc: "2.0",
              method: "eth_paymasterAndDataForUserOperation",
              params: [
                userOp,
                "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
                "0x14A33",
              ],
            }),
          }).then(response => response.json())};

        const smartAccountClient = createSmartAccountClient({
            account: res,
            chain: polygonMumbai,
            transport: http(
                `https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`,
            ),
            sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
        });

        const baseAccountClient = createSmartAccountClient({
            account: res,
            chain: baseGoerli,
            transport: http(
                `https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`,
            ),
            sponsorUserOperation: async (args: SponsorUserOperationParameters) => {
                paymasterClient.sponsorUserOperation, // optional

                    // Request for eth_paymasterAndDataForEstimateGas
                //     const gasresp = estimateGasResponse(args.userOperation);
                // // call base hjere to get the paymaster and data -> paymasterAndData
                //     args.userOperation.paymasterAndData = gasresp;


                    args.userOperation.paymasterAndData = await estimateGasResponse(args.userOperation);
                    bundlerClient.estimateUserOperationGas(args);
              
                    // Request for eth_paymasterAndDataForUserOperation
                    // const signeduserop = userOperationResponse(args.userOperation);


                    args.userOperation.paymasterAndData = await userOperationResponse(args.userOperation);

                return {
                    paymasterAndData: args.userOperation.paymasterAndData!,
                    callGasLimit: args.userOperation.callGasLimit!,
                    preVerificationGas: args.userOperation.preVerificationGas!,
                    verificationGasLimit: args.userOperation.verificationGasLimit!,
                }
            }
        });

        console.log("smartAccountClient", smartAccountClient)
        const gasPrices = await bundlerClient.getUserOperationGasPrice();
        console.log("Gas price", gasPrices);

        const accountAddress = res.address;
        const initCode = await res.getInitCode();
        const nonce = await res.getNonce();
        const getDummySignature = await res.getDummySignature();
        console.log("Addresses", accountAddress, initCode, nonce);

        // const userOperation = {
        //     sender: accountAddress,
        //     nonce: nonce,
        //     initCode,
        //     callData,
        //     maxFeePerGas: gasPrice.fast.maxFeePerGas,
        //     maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
        //     // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
        //     signature: getDummySignature as Hex
        // }


        // const txHash = await smartAccountClient.sendTransaction({
        //     to: "0x9452BCAf507CD6547574b78B810a723d8868C85a",
        //     value: parseEther("0.01"),
        //     maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
        //     maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
        // });

        // console.log("txHash", txHash);


        console.log("Public Client", publicClient, paymasterClient);

        const to = "0xBd491b4321DbE318522Ab3266590883c9F055200"
        const data = "0x68656c6c6f"

        const metadata = {
            name: "Cool NFT",
            description: "This is a Abhishek's NFT",
            image: "https://assets.ajio.com/medias/sys_master/root/20230807/qccn/64d0b9b6eebac147fcac6ee7/-473Wx593H-469496424-white-MODEL.jpg"
        };

        const callData = encodeFunctionData({
            abi: NFTAbi,
            args: [address, metadata],
            functionName: "mintTo"
        })

        const resultTx = await smartAccountClient.sendTransaction({
            to: to,
            data: callData,
        })

        console.log(resultTx);


        // const callData = encodeFunctionData({
        //     abi: [{
        //         inputs: [
        //             { name: "dest", type: "address" },
        //             { name: "value", type: "uint256" },
        //             { name: "func", type: "bytes" },
        //         ],
        //         name: "execute",
        //         outputs: [],
        //         stateMutability: "nonpayable",
        //         type: "function",
        //     }],
        //     args: [to, value, data]
        // })

        // console.log("Generated callData:", callData)

        // const gasPrice = await bundlerClient.getUserOperationGasPrice()
        // console.log("Gas price", gasPrice);

        // const userOperation = {
        //     sender: accountAddress,
        //     nonce,
        //     initCode,
        //     callData,
        //     maxFeePerGas: gasPrice.fast.maxFeePerGas,
        //     maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
        //     // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
        //     signature: "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex
        // }


        // console.log("userOperation", userOperation)

        // const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
        //     userOperation,
        //     entryPoint: ENTRY_POINT_ADDRESS
        // })

        // const sponsoredUserOperation: UserOperation = {
        //     ...userOperation,
        //     preVerificationGas: sponsorUserOperationResult.preVerificationGas,
        //     verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
        //     callGasLimit: sponsorUserOperationResult.callGasLimit,
        //     paymasterAndData: sponsorUserOperationResult.paymasterAndData
        // }

        // console.log("Received paymaster sponsor result:", sponsorUserOperationResult)


    

    }

    const getInitCode = async (address: any) => {
        const SIMPLE_ACCOUNT_FACTORY_ADDRESS = "0x9406Cc6185a346906296840746125a0E44976454"

        const initCode = concat([
            SIMPLE_ACCOUNT_FACTORY_ADDRESS,
            encodeFunctionData({
                abi: [{
                    inputs: [{ name: "owner", type: "address" }, { name: "salt", type: "uint256" }],
                    name: "createAccount",
                    outputs: [{ name: "ret", type: "address" }],
                    stateMutability: "nonpayable",
                    type: "function",
                }],
                args: [address, 0n]
            })
        ]);

        console.log("Generated initCode:", initCode)
        return initCode;

    }


    return (
        <SmartAccountContext.Provider value={{
            createSafeAccount,
            getInitCode

        }}>
            {children}
        </SmartAccountContext.Provider>
    )
}

export default SmartAccountContextProvider;