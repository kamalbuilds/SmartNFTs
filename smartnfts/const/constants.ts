import { Mumbai, Chain, BaseGoerli , MantleTestnet} from '@thirdweb-dev/chains'
// your token bound factory address
// registery
export const factoryAddress: string = '0x02101dfB77FDE026414827Fdc604ddAF224F0921'
// TBA
export const implementation: string = '0xB983F7e345Fe5493d8ABb63aE1aB52ec372b4f19'

// Your thirdweb api key - you can get one at https://thirdweb.com/dashboard/api-keys
export const TWApiKey: string = process.env.NEXT_PUBLIC_APP_TEMPLATE_CLIENT_ID || ''

export const activeChain: Chain = Mumbai;

export const loyaltyCardAddress: string = '0xE1822311D285d78EE98f5bD0f2edcF56fb7F1D29'
export const addidas: string = '0x75DE6d2dE507a8572413cfBa2cD470418eF8c162'
export const tokenAddress: string = '0x006eF094e2DF803074Ef7Bce35994771a87a6fca'

export const getaddresses: Record<number, Record<string, string>> = {
    // mumbai
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
        factoryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
        implementation: '0x8d72887163f8bD8A65649Ef4af37dcc21500e5A1',
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
        addidas: '0x6B8195Cd326B27a88Bc1D7Dc4220a29A7d96F237'
    },
    // sepolia
    534351: {
        factoryAddress: '0xdf366B8FB6553E6F5826Ee6195cb9330A34442c1',
        implementation: '0xa0c5d2d665869641e86c3d5fe3c9db4fff18f67b',
        addidas: ''
    },
    // x1
    195: {
        addidas: "0xd0206794554007F20F285f18107cFf696c9FC2c1",
        factoryAddress: "0xa0C5D2d665869641E86c3d5fE3c9dB4FFF18F67b",
        implementation: "0x9276A0ea8897A25c2f59705F6A7da9cAcC320b47",
    },
    // arb
    421613: {
        addidas: "",
        implementation: "0xdf366B8FB6553E6F5826Ee6195cb9330A34442c1",
        factoryAddress: "0x02101dfB77FDE026414827Fdc604ddAF224F0921"
    }
};

