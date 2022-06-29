import Web3 from 'web3'
import { createAlchemyWeb3 } from "@alch/alchemy-web3"
import {
    RINKEBY_URL,
    ROPSTEN_URL,
    AVAX_URL
} from '../../abi/foxieabi'

const useProvider = () => {
    let provider

    const getProvider = async (chainid) => {
        switch (chainid) {
            case '3':
                provider = createAlchemyWeb3(ROPSTEN_URL)
                return provider
            case '4':
                provider = createAlchemyWeb3(RINKEBY_URL)
                return provider
            case '43113':
                provider = new Web3(new Web3.providers.HttpProvider(AVAX_URL))
                return provider
            default:
                return null
        }
    }

    return { getProvider }
}
export default useProvider