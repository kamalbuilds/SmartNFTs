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
    84531: {
        loyaltyCardAddress: '0x25CB5C350bD3062bEaE7458805Fb069200e37fD5',
        addidas: '0x23e8a70534308a4AAF76fb8C32ec13d17a3BD89e',
        tokenAddress: '0x2332323232323232323232323232323232323232',
    },
    1442: {
        loyaltyCardAddress: '0x3456C350bD3062bEaE7458805Fb069200e37fD5',
        addidas: '0x3455656565656565656565656565656565656565',
        tokenAddress: '0x006eF094e2DF803074Ef7Bce35994771a87a6fca',
    },
    5001: {
        factoryAddress: '0xc220Fe2cAFfcAF2c333E6Ba5C12E03B28D2fe6f6',
        implementation: '0x31Db34373163A1DAAb638f813E96c8315e6078B9',
        addidas: '0x18F5c6D3F317AA621b32D190c27e32A52609a4E9'
    }
};

