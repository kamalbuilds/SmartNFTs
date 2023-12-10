import {ethers } from 'ethers';
import Limits from './limitOrderBuilder.js';

import InteractionBuilder from './interactionBuilderExample.js';

(
    async () => {
        // routerv5
        const mySmartContract = '0x11111112542d85b3ef69ae05771c2dccff4faa26'
        let interactionBuilder = new InteractionBuilder();
        let postInteraction = interactionBuilder.encodeBaseTokenBaseAmount(
            '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            10000n, // bignumberish,
            mySmartContract // wherever the interaction is going
        );

        let limitOrderBuilder = new Limits();
        let limitOrder = await limitOrderBuilder.buildOrder(postInteraction, mySmartContract);
        limitOrderBuilder.orderPlace(limitOrder);

        // construct limit order
    }
)();