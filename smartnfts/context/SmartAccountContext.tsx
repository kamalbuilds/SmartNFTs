import { createContext, useMemo } from "react";
import { Hex, concat, createClient, createPublicClient, encodeFunctionData, http, parseEther } from 'viem'
import { BASE_GOERLI_PAYMASTER_URL } from "../lib/constants";
import { baseGoerli, polygonMumbai } from "viem/chains";
import { privateKeyToSafeSmartAccount, signerToSafeSmartAccount } from "permissionless/accounts"
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { generatePrivateKey, privateKeyToAccount, toAccount } from "viem/accounts";
import { pimlicoBundlerActions, pimlicoPaymasterActions } from "permissionless/actions/pimlico";
import { UserOperation, bundlerActions, createSmartAccountClient, getSenderAddress } from "permissionless";
import NFTAbi from "../const/NFTAbi.json";

export const SmartAccountContext = createContext({})

const SmartAccountContextProvider = ({ children }: any) => {

    const thirdwebSigner = useSigner();
    const address = '0x0439427C42a099E7E362D86e2Bbe1eA27300f6Cb';

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

        const res = await signerToSafeSmartAccount(publicClient, {
            entryPoint: ENTRY_POINT_ADDRESS,
            signer: signer,
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
        }).extend(pimlicoPaymasterActions)

        const smartAccountClient = createSmartAccountClient({
            account: res,
            chain: polygonMumbai,
            transport: http(
                `https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`,
            ),
            sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
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

        const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        const value = 0n
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

        console.log("Generated callData:", callData)

        const gasPrice = await bundlerClient.getUserOperationGasPrice()
        console.log("Gas price", gasPrice);

        const userOperation = {
            sender: accountAddress,
            nonce,
            initCode,
            callData,
            maxFeePerGas: gasPrice.fast.maxFeePerGas,
            maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
            // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
            signature: "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex
        }

        console.log("userOperation", userOperation)

        const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
            userOperation,
            entryPoint: ENTRY_POINT_ADDRESS
        })

        const sponsoredUserOperation: UserOperation = {
            ...userOperation,
            preVerificationGas: sponsorUserOperationResult.preVerificationGas,
            verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
            callGasLimit: sponsorUserOperationResult.callGasLimit,
            paymasterAndData: sponsorUserOperationResult.paymasterAndData
        }

        console.log("Received paymaster sponsor result:", sponsorUserOperationResult)













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