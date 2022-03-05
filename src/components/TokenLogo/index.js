import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ROPSTEN_TOKEN_LOGOS_MAPPING, getWETH_ADDRESS, ChainId } from '../../constants'
import ETHEREUM_TOKEN_LIST from '../../constants/tokenLists/ethereum.tokenlist'
import POLYGON_TOKEN_LIST from '../../constants/tokenLists/polygon.tokenlist'
import BSC_TOKEN_LIST from '../../constants/tokenLists/bsc.tokenlist'
import AVALANCHE_TOKEN_LIST from '../../constants/tokenLists/avalanche.tokenlist'
import FANTOM_TOKEN_LIST from '../../constants/tokenLists/fantom.tokenlist'
import CRONOS_TOKEN_LIST from '../../constants/tokenLists/cronos.tokenlist'
import ARBITRUM_TOKEN_LIST from '../../constants/tokenLists/arbitrum.tokenlist'
import BTTC_TOKEN_LIST from '../../constants/tokenLists/bttc.tokenlist'
import VELAS_TOKEN_LIST from '../../constants/tokenLists/velas.tokenlist'
import { isAddress } from '../../utils/index.js'
import PlaceHolder from '../../assets/placeholder.png'
import EthereumLogo from '../../assets/eth.png'
import PolygonLogo from '../../assets/polygon.png'
import BnbLogo from '../../assets/bnb.png'
import AvaxLogo from '../../assets/avax.png'
import FantomLogo from '../../assets/networks/fantom-network.png'
import CronosLogo from '../../assets/cronos.svg'
import VelasLogo from '../../assets/velas.png'
import { getMaticTokenLogoURL } from '../../utils/maticTokenMapping'
import { getMumbaiTokenLogoURL } from '../../utils/mumbaiTokenMapping'
import { getBscTestnetTokenLogoURL } from '../../utils/bscTestnetTokenMapping'
import { getBscTokenLogoURL } from '../../utils/bscTokenMapping'
import { getAvaxTokenLogoURL } from '../../utils/avaxTokenMapping'
import { getFantomTokenLogoURL } from '../../utils/fantomTokenMapping'
import { getCronosTokenLogoURL } from '../../utils/cronosTokenMapping'
import { useNetworksInfo } from '../../contexts/NetworkInfo'

const BAD_IMAGES = {}

const Inline = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
`

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: 50%;
`

const StyledNativeTokenLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
  }
`

export function getNativeTokenLogo({ size = '24px', chainId, ...rest }) {
  let src
  switch (chainId) {
    case 137:
      src = PolygonLogo
      break
    case 80001:
      src = PolygonLogo
      break
    case 97:
      src = BnbLogo
      break
    case 56:
      src = BnbLogo
      break
    case 43113:
      src = AvaxLogo
      break
    case 43114:
      src = AvaxLogo
      break
    case 250:
      src = FantomLogo
      break
    case 338:
      src = CronosLogo
      break
    case 25:
      src = CronosLogo
      break
    case 106:
      src = VelasLogo
      break
    default:
      src = EthereumLogo
  }
  return (
    <StyledNativeTokenLogo size={size} {...rest}>
      <img
        src={src}
        style={{
          boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
          borderRadius: '24px',
        }}
        alt=''
      />
    </StyledNativeTokenLogo>
  )
}

export function getCustomLogo({ address, chainId, src, size, setError, ...rest }) {
  return (
    <Inline>
      <Image
        {...rest}
        alt={''}
        src={src}
        size={size}
        onError={event => {
          BAD_IMAGES[chainId] = { ...BAD_IMAGES[chainId], [address]: true }
          setError(true)
          event.preventDefault()
        }}
      />
    </Inline>
  )
}

export default function TokenLogo({ address, header = false, size = '24px', ...rest }) {
  const [error, setError] = useState(false)
  const [networksInfo] = useNetworksInfo()

  useEffect(() => {
    setError(false)
  }, [address, networksInfo])

  if (error || BAD_IMAGES[networksInfo.CHAIN_ID]?.[address]) {
    return (
      <Inline>
        <Image {...rest} alt={''} src={PlaceHolder} size={size} />
      </Inline>
    )
  }

  if (address?.toLowerCase() === getWETH_ADDRESS(networksInfo)) {
    return getNativeTokenLogo({ size, chainId: networksInfo.CHAIN_ID, ...rest })
  }

  const formattedAddress = isAddress(address)
  let path

  switch (networksInfo.CHAIN_ID) {
    case 3:
      if (ROPSTEN_TOKEN_LOGOS_MAPPING[address?.toLowerCase()]) {
        address = ROPSTEN_TOKEN_LOGOS_MAPPING[address?.toLowerCase()]
      }

      path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${formattedAddress}/logo.png`
      break
    case 137:
      if (formattedAddress && POLYGON_TOKEN_LIST[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networksInfo.CHAIN_ID,
          src: POLYGON_TOKEN_LIST[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }

      path = getMaticTokenLogoURL(address)
      break
    case 80001:
      path = getMumbaiTokenLogoURL(address)
      break
    case 97:
      path = getBscTestnetTokenLogoURL(address)
      break
    case 56:
      if (formattedAddress && BSC_TOKEN_LIST[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networksInfo.CHAIN_ID,
          src: BSC_TOKEN_LIST[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = getBscTokenLogoURL(address)
      break

    case 43114:
      if (formattedAddress && AVALANCHE_TOKEN_LIST[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networksInfo.CHAIN_ID,
          src: AVALANCHE_TOKEN_LIST[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = getAvaxTokenLogoURL(address)
      break

    case 250:
      if (formattedAddress && FANTOM_TOKEN_LIST[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networksInfo.CHAIN_ID,
          src: FANTOM_TOKEN_LIST[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = getFantomTokenLogoURL(address)
      break

    case 25:
      if (formattedAddress && CRONOS_TOKEN_LIST[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networksInfo.CHAIN_ID,
          src: CRONOS_TOKEN_LIST[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = getCronosTokenLogoURL(address)
      break

    case ChainId.ARBITRUM:
      if (formattedAddress && ARBITRUM_TOKEN_LIST[formattedAddress]) {
        return getCustomLogo({ address, src: ARBITRUM_TOKEN_LIST[formattedAddress].logoURI, size, setError, ...rest })
      }
      path = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/${isAddress(address)}/logo.png`
      break

    case ChainId.BTTC:
      if (formattedAddress && BTTC_TOKEN_LIST[formattedAddress]) {
        return getCustomLogo({ address, src: BTTC_TOKEN_LIST[formattedAddress].logoURI, size, setError, ...rest })
      }
      break

    case ChainId.VELAS:
      if (formattedAddress && VELAS_TOKEN_LIST[formattedAddress]) {
        return getCustomLogo({ address, src: VELAS_TOKEN_LIST[formattedAddress].logoURI, size, setError, ...rest })
      }
      path = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/${isAddress(
        //todo namgold: fill this
        address
      )}/logo.png`
      break

    default:
      if (formattedAddress && ETHEREUM_TOKEN_LIST[formattedAddress]?.logoURI) {
        return getCustomLogo({
          address,
          chainId: networksInfo.CHAIN_ID,
          src: ETHEREUM_TOKEN_LIST[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }

      // hard coded fixes for trust wallet api issues
      if (address?.toLowerCase() === '0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb') {
        address = '0x42456d7084eacf4083f1140d3229471bba2949a8'
      }

      if (address?.toLowerCase() === '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f') {
        address = '0xc011a72400e58ecd99ee497cf89e3775d4bd732f'
      }

      path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${formattedAddress}/logo.png`
      break
  }

  return (
    <Inline>
      <Image
        {...rest}
        alt={''}
        src={path}
        srcSet=''
        size={size}
        onError={event => {
          BAD_IMAGES[networksInfo.CHAIN_ID] = { ...BAD_IMAGES[networksInfo.CHAIN_ID], [address]: true }
          setError(true)
          event.preventDefault()
        }}
      />
    </Inline>
  )
}
