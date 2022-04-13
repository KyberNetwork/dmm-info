import Mainnet from '../assets/networks/mainnet-network.svg'
import Polygon from '../assets/networks/polygon-network.png'
import BSC from '../assets/networks/bsc-network.png'
import AVAX from '../assets/networks/avax-network.png'
import Fantom from '../assets/networks/fantom-network.png'
import Cronos from '../assets/networks/cronos-network.png'
import Arbitrum from '../assets/networks/arbitrum-network.svg'
import BitTorrent from '../assets/networks/bittorrent-network.png'
import Velas from '../assets/networks/velas-network.png'
import Aurora from '../assets/networks/aurora-network.svg'
import Oasis from '../assets/networks/oasis-network.svg'

import ETHEREUM_TOKEN_LIST from './tokenLists/ethereum.tokenlist'
import BSC_TOKEN_LIST from './tokenLists/bsc.tokenlist'
import POLYGON_TOKEN_LIST from './tokenLists/polygon.tokenlist'
import AVALANCHE_TOKEN_LIST from './tokenLists/avalanche.tokenlist'
import FANTOM_TOKEN_LIST from './tokenLists/fantom.tokenlist'
import CRONOS_TOKEN_LIST from './tokenLists/cronos.tokenlist'
import ARBITRUM_TOKEN_LIST from './tokenLists/arbitrum.tokenlist'
import BTTC_TOKEN_LIST from './tokenLists/bttc.tokenlist'
import VELAS_TOKEN_LIST from './tokenLists/velas.tokenlist'
import AURORA_TOKEN_LIST from './tokenLists/aurora.tokenlist'
import OASIS_TOKEN_LIST from './tokenLists/oasis.tokenlist'

import EthereumLogo from '../assets/eth.png'
import MaticLogo from '../assets/polygon.png'
import BnbLogo from '../assets/bnb.png'
import AvaxLogo from '../assets/avax.png'
import FantomLogo from '../assets/networks/fantom-network.png'
import CronosLogo from '../assets/cronos.svg'
import BTTCLogo from '../assets/bttc.png'
import VelasLogo from '../assets/velas.png'
import AuroraLogo from '../assets/aurora.svg'
import OasisLogo from '../assets/oasis.svg'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  MATIC = 137,
  MUMBAI = 80001,
  BSCTESTNET = 97,
  BSCMAINNET = 56,
  AVAXTESTNET = 43113,
  AVAXMAINNET = 43114,
  FANTOM = 250,
  CRONOSTESTNET = 338,
  CRONOS = 25,
  ARBITRUM_TESTNET = 421611,
  ARBITRUM = 42161,
  BTTC = 199,
  VELAS = 106,
  AURORA = 1313161554,
  OASIS = 42262,
}

export type NETWORK_INFO = {
  chainId: ChainId
  icon: string
  name: string
  urlKey: string
  dmmSwapUrl: string
  factoryAddress: string
  subgraphName: string
  subgraphUrls: string[]
  subgraphBlockUrl: string
  etherscanUrl: string
  kncAddress: string
  wethAddress: string
  defaultStartTime: number
  nativeTokenSymbol: string
  nativeTokenWrappedName: string
  nativeTokenLogo: string
  etherscanLinkText: string
  tokenLists: {
    [key: string]: {
      address: string
      symbol: string
      name: string
      decimals: number
      logoURI?: string
    }
  }
}

export const NETWORK_INFOS: { [key in ChainId]: NETWORK_INFO } = {
  [ChainId.MAINNET]: {
    chainId: ChainId.MAINNET,
    icon: Mainnet,
    name: 'Ethereum',
    urlKey: 'ethereum',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0x833e4083B7ae46CeA85695c4f7ed25CDAd8886dE',
    subgraphName: 'dynamic-amm/dynamic-amm',
    subgraphUrls: ['https://api.thegraph.com/subgraphs/name/dynamic-amm/dynamic-amm'],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/dynamic-amm/ethereum-blocks-ethereum',
    etherscanUrl: 'https://etherscan.io',
    kncAddress: '0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202',
    wethAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    defaultStartTime: 1620201600,
    nativeTokenSymbol: 'ETH',
    nativeTokenWrappedName: 'Ether (Wrapped)',
    nativeTokenLogo: EthereumLogo,
    etherscanLinkText: 'Etherscan',
    tokenLists: ETHEREUM_TOKEN_LIST,
  },
  [ChainId.ROPSTEN]: {
    chainId: ChainId.ROPSTEN,
    icon: Mainnet,
    name: 'Ropsten',
    urlKey: 'ropsten',
    dmmSwapUrl: 'https://dev-dmm.knstats.com/#/',
    factoryAddress: '0x0639542a5cd99bd5f4e85f58cb1f61d8fbe32de9',
    subgraphName: 'piavgh/dmm-exchange-ropsten',
    subgraphUrls: ['https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-ropsten'],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/edwardevans094/ropsten-blocks',
    etherscanUrl: 'https://ropsten.etherscan.io',
    kncAddress: '0x8B4DDF9F13f382aff76D262F6C8C50E6d7961b94',
    wethAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    defaultStartTime: 1620201600,
    nativeTokenSymbol: 'ETH',
    nativeTokenWrappedName: 'Ether (Wrapped)',
    nativeTokenLogo: EthereumLogo,
    etherscanLinkText: 'Etherscan',
    tokenLists: ETHEREUM_TOKEN_LIST,
  },
  [ChainId.MATIC]: {
    chainId: ChainId.MATIC,
    icon: Polygon,
    name: 'Polygon',
    urlKey: 'polygon',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0x5f1fe642060b5b9658c15721ea22e982643c095c',
    subgraphName: 'dynamic-amm/dmm-exchange-matic',
    subgraphUrls: [
      'https://api.thegraph.com/subgraphs/name/dynamic-amm/dmm-exchange-matic',
      'https://polygon-subgraph.dmm.exchange/subgraphs/name/dynamic-amm/dmm-exchange-matic',
    ],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/dynamic-amm/ethereum-blocks-polygon',
    etherscanUrl: 'https://polygonscan.com',
    kncAddress: '0x1C954E8fe737F99f68Fa1CCda3e51ebDB291948C',
    wethAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    defaultStartTime: 1625097600,
    nativeTokenSymbol: 'MATIC',
    nativeTokenWrappedName: 'Matic (Wrapped)',
    nativeTokenLogo: MaticLogo,
    etherscanLinkText: 'Polygonscan',
    tokenLists: POLYGON_TOKEN_LIST,
  },
  [ChainId.MUMBAI]: {
    chainId: ChainId.MUMBAI,
    icon: Polygon,
    name: 'Mumbai',
    urlKey: 'mumbai',
    dmmSwapUrl: 'https://dev-dmm.knstats.com/#/',
    factoryAddress: '0x7900309d0b1c8d3d665ae40e712e8ba4fc4f5453', //todo: check this
    subgraphName: 'piavgh/dmm-exchange-mumbai',
    subgraphUrls: ['https://api.thegraph.com/subgraphs/name/piavgh/dmm-exchange-mumbai'],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/piavgh/mumbai-blocks',
    etherscanUrl: 'https://mumbai.polygonscan.com',
    kncAddress: '0xFD1f9381Cb641Dc76Fe8087dbcf8ea84a2c77cbE',
    wethAddress: '0x9c3c9283d3e44854697cd22d3faa240cfb032889',
    defaultStartTime: 1625097600,
    nativeTokenSymbol: 'MATIC',
    nativeTokenWrappedName: 'Matic (Wrapped)',
    nativeTokenLogo: MaticLogo,
    etherscanLinkText: 'Polygonscan',
    tokenLists: POLYGON_TOKEN_LIST,
  },
  [ChainId.BSCMAINNET]: {
    chainId: ChainId.BSCMAINNET,
    icon: BSC,
    name: 'BSC',
    urlKey: 'bsc',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0x878dfe971d44e9122048308301f540910bbd934c',
    subgraphName: 'dynamic-amm/dmm-exchange-bsc',
    subgraphUrls: [
      'https://api.thegraph.com/subgraphs/name/dynamic-amm/dmm-exchange-bsc',
      'https://bsc-subgraph.dmm.exchange/subgraphs/name/dynamic-amm/dmm-exchange-bsc',
    ],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/dynamic-amm/ethereum-blocks-bsc',
    etherscanUrl: 'https://bscscan.com',
    kncAddress: '0xfe56d5892bdffc7bf58f2e84be1b2c32d21c308b',
    wethAddress: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    defaultStartTime: 1630313700,
    nativeTokenSymbol: 'BNB',
    nativeTokenWrappedName: 'BNB (Wrapped)',
    nativeTokenLogo: BnbLogo,
    etherscanLinkText: 'Bscscan',
    tokenLists: BSC_TOKEN_LIST,
  },
  [ChainId.BSCTESTNET]: {
    chainId: ChainId.BSCTESTNET,
    icon: BSC,
    name: 'BSC Testnet',
    urlKey: 'bsc-testnet',
    dmmSwapUrl: 'https://dev-dmm.knstats.com/#/',
    factoryAddress: '0x7900309d0b1c8d3d665ae40e712e8ba4fc4f5453', //todo: check this
    subgraphName: 'ducquangkstn/dynamic-amm-ropsten',
    subgraphUrls: ['https://api.thegraph.com/subgraphs/name/ducquangkstn/dynamic-amm-ropsten'],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/ducquangkstn/ethereum-blocks-bsctestnet',
    etherscanUrl: 'https://testnet.bscscan.com',
    kncAddress: '0xfd1f9381cb641dc76fe8087dbcf8ea84a2c77cbe',
    wethAddress: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    defaultStartTime: 1628074210,
    nativeTokenSymbol: 'BNB',
    nativeTokenWrappedName: 'BNB (Wrapped)',
    nativeTokenLogo: BnbLogo,
    etherscanLinkText: 'Bscscan',
    tokenLists: BSC_TOKEN_LIST,
  },
  [ChainId.AVAXMAINNET]: {
    chainId: ChainId.AVAXMAINNET,
    icon: AVAX,
    name: 'Avalanche',
    urlKey: 'avalanche',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0x10908c875d865c66f271f5d3949848971c9595c9',
    subgraphName: 'dynamic-amm/dmm-exchange-avax',
    subgraphUrls: [
      'https://api.thegraph.com/subgraphs/name/dynamic-amm/dmm-exchange-avax',
      'https://avax-subgraph.dmm.exchange/subgraphs/name/dynamic-amm/dmm-exchange-avax',
    ],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/ducquangkstn/avalache-blocks',
    etherscanUrl: 'https://snowtrace.io',
    kncAddress: '',
    wethAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    defaultStartTime: 1630431653,
    nativeTokenSymbol: 'AVAX',
    nativeTokenWrappedName: 'AVAX (Wrapped)',
    nativeTokenLogo: AvaxLogo,
    etherscanLinkText: 'Snowtrace',
    tokenLists: AVALANCHE_TOKEN_LIST,
  },
  [ChainId.AVAXTESTNET]: {
    //todo: check this
    chainId: ChainId.AVAXTESTNET,
    icon: AVAX,
    name: 'Avalanche Testnest',
    urlKey: 'avalanche-testnet',
    dmmSwapUrl: 'https://dev-dmm.knstats.com/#/',
    factoryAddress: '0x10908c875d865c66f271f5d3949848971c9595c9',
    subgraphName: 'ducquangkstn/dmm-exchange-fuij',
    subgraphUrls: ['https://api.thegraph.com/subgraphs/name/ducquangkstn/dmm-exchange-fuij'],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/ducquangkstn/avalache-blocks',
    etherscanUrl: 'https://testnet.snowtrace.io/',
    kncAddress: '',
    wethAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    defaultStartTime: 1630431653,
    nativeTokenSymbol: 'AVAX',
    nativeTokenWrappedName: 'AVAX (Wrapped)',
    nativeTokenLogo: AvaxLogo,
    etherscanLinkText: 'Snowtrace',
    tokenLists: AVALANCHE_TOKEN_LIST,
  },
  [ChainId.FANTOM]: {
    chainId: ChainId.FANTOM,
    icon: Fantom,
    name: 'Fantom',
    urlKey: 'fantom',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0x78df70615ffc8066cc0887917f2Cd72092C86409',
    subgraphName: 'dynamic-amm/dmm-exchange-ftm',
    subgraphUrls: ['https://api.thegraph.com/subgraphs/name/dynamic-amm/dmm-exchange-ftm'],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/dynamic-amm/ethereum-blocks-fantom',
    etherscanUrl: 'https://ftmscan.com',
    kncAddress: '0x765277eebeca2e31912c9946eae1021199b39c61',
    wethAddress: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    defaultStartTime: 1634290369,
    nativeTokenSymbol: 'FTM',
    nativeTokenWrappedName: 'FTM (Wrapped)',
    nativeTokenLogo: FantomLogo,
    etherscanLinkText: 'Ftmscan',
    tokenLists: FANTOM_TOKEN_LIST,
  },
  [ChainId.CRONOS]: {
    chainId: ChainId.CRONOS,
    icon: Cronos,
    name: 'Cronos',
    urlKey: 'cronos',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0xd9bfe9979e9ca4b2fe84ba5d4cf963bbcb376974',
    subgraphName: 'kyberswap/kyberswap-cronos',
    subgraphUrls: ['https://cronos-subgraph.kyberswap.com/subgraphs/name/kyberswap/kyberswap-cronos'],
    subgraphBlockUrl: 'https://cronos-subgraph.kyberswap.com/subgraphs/name/dynamic-amm/ethereum-blocks-cronos',
    etherscanUrl: 'https://cronos.crypto.org/explorer',
    kncAddress: '0x868fc5cb3367c4a43c350b85d5001acaf58a857e',
    wethAddress: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23',
    defaultStartTime: 1638851256,
    nativeTokenSymbol: 'CRO',
    nativeTokenWrappedName: 'CRO (Wrapped)',
    nativeTokenLogo: CronosLogo,
    etherscanLinkText: 'Explorer',
    tokenLists: CRONOS_TOKEN_LIST,
  },
  [ChainId.CRONOSTESTNET]: {
    chainId: ChainId.CRONOSTESTNET,
    icon: Cronos,
    name: 'Cronos Testnet',
    urlKey: 'cronos-testnet',
    dmmSwapUrl: 'https://dev-dmm.knstats.com/#/',
    factoryAddress: '0x9fe747aea6173dd2c72e9d9bf4e2bcbbc0f8ad9e',
    subgraphName: 'dynamic-amm/dmm-exchange-cronos-testnet',
    subgraphUrls: ['https://testnet-cronos-subgraph.knstats.com/subgraphs/name/dynamic-amm/dmm-exchange-cronos-testnet'],
    subgraphBlockUrl: 'https://testnet-cronos-subgraph.knstats.com/subgraphs/name/dynamic-amm/ethereum-blocks-cronos-testnet',
    etherscanUrl: 'https://cronos.crypto.org/explorer/testnet3',
    kncAddress: '0x868fc5cb3367c4a43c350b85d5001acaf58a857e',
    wethAddress: '0x1a46dcac1d91f1731574befaedac4e0392726e35',
    defaultStartTime: 1630431653,
    nativeTokenSymbol: 'CRO',
    nativeTokenWrappedName: 'CRO (Wrapped)',
    nativeTokenLogo: CronosLogo,
    etherscanLinkText: 'Explorer',
    tokenLists: CRONOS_TOKEN_LIST,
  },
  [ChainId.ARBITRUM]: {
    chainId: ChainId.ARBITRUM,
    icon: Arbitrum,
    name: 'Arbitrum',
    urlKey: 'arbitrum',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0x51e8d106c646ca58caf32a47812e95887c071a62',
    subgraphName: 'viet-nv/kyberswap-arbitrum',
    subgraphUrls: ['https://arbitrum-graph.kyberengineering.io/subgraphs/name/kybernetwork/kyberswap-exchange-arbitrum'],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/viet-nv/arbitrum-blocks',
    etherscanUrl: 'https://arbiscan.io',
    kncAddress: '0x868fc5cb3367c4a43c350b85d5001acaf58a857e',
    wethAddress: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23',
    defaultStartTime: 1644536463,
    nativeTokenSymbol: 'ETH',
    nativeTokenWrappedName: 'Ether (Wrapped)',
    nativeTokenLogo: EthereumLogo,
    etherscanLinkText: 'Arbiscan',
    tokenLists: ARBITRUM_TOKEN_LIST,
  },
  [ChainId.ARBITRUM_TESTNET]: {
    chainId: ChainId.ARBITRUM_TESTNET,
    icon: Arbitrum,
    name: 'Arbitrum Rinkeby',
    urlKey: 'arbitrum-rinkeby',
    dmmSwapUrl: 'https://dev-dmm.knstats.com/#/',
    factoryAddress: '0x570797C68C6D060503b2CfcBe5780205057010d5',
    subgraphName: 'viet-nv/kyberswap-arbitrum-rinkeby',
    subgraphUrls: ['https://api.thegraph.com/subgraphs/name/viet-nv/kyberswap-arbitrum-rinkeby'],
    subgraphBlockUrl: 'https://api.thegraph.com/subgraphs/name/viet-nv/arbitrum-rinkeby-blocks',
    etherscanUrl: 'https://testnet.arbiscan.io',
    kncAddress: '0x7596961744096D12eFa3CfA58d1D30EDd82BD396',
    wethAddress: '0x93D51226c4C3c265ca0c2F6420fa4c6A9151c09e',
    defaultStartTime: 1644212237,
    nativeTokenSymbol: 'ETH',
    nativeTokenWrappedName: 'Ether (Wrapped)',
    nativeTokenLogo: EthereumLogo,
    etherscanLinkText: 'Arbiscan',
    tokenLists: ARBITRUM_TOKEN_LIST,
  },
  [ChainId.BTTC]: {
    chainId: ChainId.BTTC,
    icon: BitTorrent,
    name: 'BitTorrent',
    urlKey: 'bittorrent',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0xD9bfE9979e9CA4b2fe84bA5d4Cf963bBcB376974',
    subgraphName: 'dynamic-amm/kyberswap-bttc',
    subgraphUrls: ['https://bttc-graph.kyberengineering.io/subgraphs/name/kybernetwork/kyberswap-exchange-bttc'],
    subgraphBlockUrl: 'https://bttc-graph.dev.kyberengineering.io/subgraphs/name/dynamic-amm/bttc-blocks',
    etherscanUrl: 'https://bttcscan.com',
    kncAddress: '0x868fc5cb3367c4a43c350b85d5001acaf58a857e',
    wethAddress: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23',
    defaultStartTime: 1645007928,
    nativeTokenSymbol: 'BTT',
    nativeTokenWrappedName: 'BTT (Wrapped)',
    nativeTokenLogo: BTTCLogo,
    etherscanLinkText: 'Bttcscan',
    tokenLists: BTTC_TOKEN_LIST,
  },
  [ChainId.VELAS]: {
    chainId: ChainId.VELAS,
    icon: Velas,
    name: 'Velas',
    urlKey: 'velas',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0xaf0936B1DC49B5c7444CA838A5f32080FC043AdD',
    subgraphName: 'kybernetwork/kyberswap-exchange-velas',
    subgraphUrls: ['https://velas-graph.kyberengineering.io/subgraphs/name/kybernetwork/kyberswap-exchange-velas'],
    subgraphBlockUrl: 'https://velas-graph.kyberengineering.io/subgraphs/name/kybernetwork/velas-blocks',
    etherscanUrl: 'https://evmexplorer.velas.com',
    kncAddress: '0xfe56d5892bdffc7bf58f2e84be1b2c32d21c308b',
    wethAddress: '0xc579D1f3CF86749E05CD06f7ADe17856c2CE3126',
    defaultStartTime: 1630313700,
    nativeTokenSymbol: 'VLX',
    nativeTokenWrappedName: 'VLX (Wrapped)',
    nativeTokenLogo: VelasLogo,
    etherscanLinkText: 'Velas EVM Explorer',
    tokenLists: VELAS_TOKEN_LIST,
  },
  [ChainId.AURORA]: {
    chainId: ChainId.AURORA,
    icon: Aurora,
    name: 'Aurora',
    urlKey: 'aurora',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0x39a8809fbbf22ccaeac450eaf559c076843eb910',
    subgraphName: 'piavgh/dmm-exchange-aurora',
    subgraphUrls: ['https://aurora-graph.kyberengineering.io/subgraphs/name/kybernetwork/kyberswap-exchange-aurora'],
    subgraphBlockUrl: 'https://aurora-graph.kyberengineering.io/subgraphs/name/kybernetwork/aurora-blocks',
    etherscanUrl: 'https://aurorascan.dev',
    kncAddress: '0xfe56d5892bdffc7bf58f2e84be1b2c32d21c308b',
    wethAddress: '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB',
    defaultStartTime: 1630313700,
    nativeTokenSymbol: 'ETH',
    nativeTokenWrappedName: 'ETH (Wrapped)',
    nativeTokenLogo: AuroraLogo,
    etherscanLinkText: 'Aurora Explorer',
    tokenLists: AURORA_TOKEN_LIST,
  },
  [ChainId.OASIS]: {
    chainId: ChainId.OASIS,
    icon: Oasis,
    name: 'Oasis',
    urlKey: 'oasis',
    dmmSwapUrl: 'https://kyberswap.com/#/',
    factoryAddress: '0xD9bfE9979e9CA4b2fe84bA5d4Cf963bBcB376974',
    subgraphName: 'kybernetwork/kyberswap-exchange-oasis',
    subgraphUrls: ['https://oasis-graph.kyberengineering.io/subgraphs/name/kybernetwork/kyberswap-exchange-oasis'],
    subgraphBlockUrl: 'https://oasis-graph.kyberengineering.io/subgraphs/name/kybernetwork/oasis-blocks',
    etherscanUrl: 'https://explorer.emerald.oasis.dev',
    kncAddress: '0xfe56d5892bdffc7bf58f2e84be1b2c32d21c308b',
    wethAddress: '0x21C718C22D52d0F3a789b752D4c2fD5908a8A733',
    defaultStartTime: 1647932400,
    nativeTokenSymbol: 'ROSE',
    nativeTokenWrappedName: 'ROSE (Wrapped)',
    nativeTokenLogo: OasisLogo,
    etherscanLinkText: 'Oasis Emerald Explorer',
    tokenLists: OASIS_TOKEN_LIST,
  },
}
