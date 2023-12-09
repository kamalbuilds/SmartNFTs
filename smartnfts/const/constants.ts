import { Mumbai, Chain, BaseGoerli , MantleTestnet} from '@thirdweb-dev/chains'
// your token bound factory address
// registery
export const factoryAddress: string = '0x02101dfB77FDE026414827Fdc604ddAF224F0921'
// TBA
export const implementation: string = '0xB983F7e345Fe5493d8ABb63aE1aB52ec372b4f19'

// Your thirdweb api key - you can get one at https://thirdweb.com/dashboard/api-keys
export const TWApiKey: string = process.env.NEXT_PUBLIC_APP_TEMPLATE_CLIENT_ID || ''

export const activeChain: Chain = MantleTestnet;

export const loyaltyCardAddress: string = '0xE1822311D285d78EE98f5bD0f2edcF56fb7F1D29'
export const addidas: string = '0x18F5c6D3F317AA621b32D190c27e32A52609a4E9'
export const tokenAddress: string = '0x006eF094e2DF803074Ef7Bce35994771a87a6fca'

export const getaddresses: Record<number, Record<string, string>> = {
    80001: {
        loyaltyCardAddress: '0x25CB5C350bD3062bEaE7458805Fb069200e37fD5',
        addidas: '0xBd491b4321DbE318522Ab3266590883c9F055200',
        tokenAddress: '0x006eF094e2DF803074Ef7Bce35994771a87a6fca',
        factoryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
        implementation: '0xB983F7e345Fe5493d8ABb63aE1aB52ec372b4f19',
    },
    // base goerli
    84531: {
        loyaltyCardAddress: '0x25CB5C350bD3062bEaE7458805Fb069200e37fD5',
        addidas: '0x75DE6d2dE507a8572413cfBa2cD470418eF8c162',
    },
    // mantle testnet
    5001: {
        factoryAddress: '0xc220Fe2cAFfcAF2c333E6Ba5C12E03B28D2fe6f6',
        implementation: '0xe551c18b1dfC8A2c21B7B3df932a64Aa07018c11',
        addidas: '0x18F5c6D3F317AA621b32D190c27e32A52609a4E9'
    },
    // zkevm
    1442: {
        factoryAddress: '0x5c729acd895eaa2b6a415219af6fb49b2ff7f5c3',
        implementation: '0xbEA03c2A49aE2D9671900efeFdC604304f5CA957',
        addidas: '0x18F5c6D3F317AA621b32D190c27e32A52609a4E9'
    },
};

