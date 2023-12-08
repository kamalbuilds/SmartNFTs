// using node 14.21.12
// import fetch from 'node-fetch'; // specifically version node-fetch@2.6.7 
// node 20 now has fetch built in, so this is no longer necessary

import Web3 from 'web3';

import {
    limitOrderProtocolAddresses,
    seriesNonceManagerContractAddresses,
    ChainId,
    Erc20Facade,
    LimitOrderBuilder,
    LimitOrderProtocolFacade,
    LimitOrderPredicateBuilder,
    NonceSeriesV2,  
    SeriesNonceManagerFacade,
    SeriesNonceManagerPredicateBuilder,
    Web3ProviderConnector, // used for interfaces
    PrivateKeyProviderConnector
} from '@1inch/limit-order-protocol-utils'; // @^3.0 so npm i @1inch/limit-order-protocol-utils@^3


    // let infuraKey = "...";
    let inchDevApiKey = "...";
    const web3 = new Web3('https://cloudflare-eth.com/');
    const connector = new PrivateKeyProviderConnector("6cf3b26e7fdb9d7f3564d0d44f69c5c65c2a2f7bf48d852c2ea8512b5bcdaad5", web3); //it's usually best not to store the private key in the code as plain text, encrypting/decrypting it is a good practice
    const walletAddress = "0x05f2a859c61CE549d5DCBAA0e61844bD3276d4fd" // the public address associated with your private key
    const chainId = 1; // suggested, or use your own number
    const contractAddress = limitOrderProtocolAddresses[chainId];
    const seriesContractAddress = seriesNonceManagerContractAddresses[chainId];

    const fromToken = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';                  //this is the token address that you want to sell
    const toToken = '0xdAC17F958D2ee523a2206206994597C13D831ec7';                    //this is the token address that you want to buy
    const fromAmount = '100000000';                                                          //this is the amount of tokens you want to sell, make sure it's in minimum divisible units
    const toAmount = '100000000';                                                //this is how much of the to token you want to buy. make sure it's in minimum divisible units
    const seconds = 60;                                                              //this is how many seconds the order is active for, it can be any non-negative number


    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(contractAddress, chainId, connector);
    const seriesNonceManagerFacade = new SeriesNonceManagerFacade(seriesContractAddress, chainId, connector);
    const seriesNonceManagerPredicateBuilder = new SeriesNonceManagerPredicateBuilder(seriesNonceManagerFacade);
    const limitOrderPredicateBuilder = new LimitOrderPredicateBuilder(limitOrderProtocolFacade);
    const erc20Facade = new Erc20Facade(connector);

    // const limitOrderBuilder = new LimitOrderBuilder(limitOrderProtocolFacade, erc20Facade);
    const limitOrderBuilder = new LimitOrderBuilder(contractAddress, chainId, connector);

export default class Limits {

    // suggested parameters: expirationTime, userNonce, fromTokenAddress, toTokenAddress, fromTokenAmount, toTokenAmount, postInteraction
    buildOrder(postInteraction, mySmartContract) {

        const expiration = Math.floor(Date.now() / 1000) + seconds; // expiration in seconds
        // const nonce = seriesNonceManagerFacade.getNonce(NonceSeriesV2.LimitOrderV3, walletAddress).then((nonce) => nonce.toNumber());
        // above doesn't work without an await so we'll temporarily hardcode the nonce
        const nonce = 0;
        // Creates predicate that restricts Limit Order invalidation conditions
        // Because timestampBelowAndNonceEquals is method of another contract arbitraryStaticCall() is necessary
        const simpleLimitOrderPredicate = limitOrderPredicateBuilder.arbitraryStaticCall( // is type LimitOrderPredicateCallData
            seriesNonceManagerPredicateBuilder.facade,
            seriesNonceManagerPredicateBuilder.timestampBelowAndNonceEquals(
                NonceSeriesV2.LimitOrderV3,
                expiration,
                nonce,
                walletAddress,
            ),
        );

        const limitOrder = limitOrderBuilder.buildLimitOrder({
            makerAssetAddress: fromToken,
            takerAssetAddress: toToken,
            makerAddress: walletAddress,
            makingAmount: fromAmount,
            takingAmount: toAmount,
            predicate: simpleLimitOrderPredicate,
            salt: "" + Math.floor(Math.random()*100000000),
            postInteraction: postInteraction,
            receiver: mySmartContract,
        });
        
        return limitOrder;
    }


    async getSignatureAndHash(limitOrder) {

        const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(
            limitOrder,
        );
        const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(
            connector,
            limitOrderTypedData,
        );

        const limitOrderHash = await limitOrderBuilder.buildLimitOrderHash(
            limitOrderTypedData
        );
        
        return [limitOrderSignature, limitOrderHash];
    }

    /*
        * The following code is for placing the order with a call to the 1inch API
        * this can be modified to take in the data, for now the data is hardcoded above
        @param limitOrderData: untyped data of the limit order (all are strings)
        @param limitOrderSignature: signature of the limit order
        @param limitOrderHash: hash of the limit order
    */

    async orderPlace(limitOrder) {

        const [limitOrderSignature, limitOrderHash] = await this.getSignatureAndHash(limitOrder);

        const signature = await limitOrderSignature;
        const data = {
            "orderHash": limitOrderHash,
            "signature": signature,
            "data": limitOrder
        }
        console.log(JSON.stringify(data, null, 2));

        
    }

}