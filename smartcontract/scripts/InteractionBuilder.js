import { ethers } from 'ethers';
export default class InteractionBuilder {

    globalEncoder = new ethers.utils.AbiCoder();


    buildInteraction(target, calldata)
    {
        return target+calldata.replaceAll('0x', '');
    }


    encodeBaseTokenBaseAmount(token, amount, mySmartContract)
    {
        /*
        (address baseToken, uint baseAmount) = abi.decode(
            interactionData,
            (address, uint256)
        );
        */
        let calldata = this.globalEncoder.encode(['address', 'uint256'], [token, amount]);
        return this.buildInteraction(mySmartContract, calldata);
    }



}