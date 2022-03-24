import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { ROPSTEN_TOKEN_LOGOS_MAPPING } from '../../constants'
import { isAddress } from '../../utils/index.js'
import PlaceHolder from '../../assets/placeholder.png'
import { getMaticTokenLogoURL } from '../../utils/maticTokenMapping'
import { getMumbaiTokenLogoURL } from '../../utils/mumbaiTokenMapping'
import { getBscTestnetTokenLogoURL } from '../../utils/bscTestnetTokenMapping'
import { getBscTokenLogoURL } from '../../utils/bscTokenMapping'
import { getAvaxTokenLogoURL } from '../../utils/avaxTokenMapping'
import { getFantomTokenLogoURL } from '../../utils/fantomTokenMapping'
import { getCronosTokenLogoURL } from '../../utils/cronosTokenMapping'
import { ChainId } from '../../constants/networks'
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

//todo: dò reference TokenLogo networkInfo
export default function TokenLogo({ address, networkInfo, header = false, size = '24px', ...rest }) {
  const [error, setError] = useState(false)
  const [networksInfo] = useNetworksInfo()

  useEffect(() => {
    setError(false)
  }, [address, networkInfo])

  if (!networkInfo) return null

  if (error || BAD_IMAGES[networkInfo.chainId]?.[address]) {
    return (
      <Inline>
        <Image {...rest} alt={''} src={PlaceHolder} size={size} />
      </Inline>
    )
  }

  if (address?.toLowerCase() === networkInfo.wethAddress) {
    return (
      <StyledNativeTokenLogo size={size} {...rest}>
        <img
          src={networkInfo.nativeTokenLogo}
          style={{
            boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.075)',
            borderRadius: '24px',
          }}
          alt=''
        />
      </StyledNativeTokenLogo>
    )
  }

  const formattedAddress = isAddress(address)
  let path

  switch (networkInfo.chainId) {
    case ChainId.ROPSTEN:
      if (ROPSTEN_TOKEN_LOGOS_MAPPING[address?.toLowerCase()]) {
        address = ROPSTEN_TOKEN_LOGOS_MAPPING[address?.toLowerCase()]
      }

      path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${formattedAddress}/logo.png`
      break
    case ChainId.MATIC:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networkInfo.chainId,
          src: networkInfo.tokenLists[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }

      path = getMaticTokenLogoURL(address)
      break
    case ChainId.MUMBAI:
      path = getMumbaiTokenLogoURL(address)
      break
    case ChainId.BSCTESTNET:
      path = getBscTestnetTokenLogoURL(address)
      break
    case ChainId.BSCMAINNET:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networkInfo.chainId,
          src: networkInfo.tokenLists[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = getBscTokenLogoURL(address)
      break

    case ChainId.AVAXMAINNET:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networkInfo.chainId,
          src: networkInfo.tokenLists[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = getAvaxTokenLogoURL(address)
      break

    case ChainId.FANTOM:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networkInfo.chainId,
          src: networkInfo.tokenLists[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = getFantomTokenLogoURL(address)
      break

    case ChainId.CRONOS:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({
          address,
          chainId: networkInfo.chainId,
          src: networkInfo.tokenLists[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = getCronosTokenLogoURL(address)
      break

    case ChainId.ARBITRUM:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({
          address,
          src: networkInfo.tokenLists[formattedAddress].logoURI,
          size,
          setError,
          ...rest,
        })
      }
      path = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/${isAddress(address)}/logo.png`
      break

    case ChainId.BTTC:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({ address, src: networkInfo.tokenLists[formattedAddress].logoURI, size, setError, ...rest })
      }
      path = 'error'
      break

    case ChainId.OASIS:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({ address, src: networkInfo.tokenLists[formattedAddress].logoURI, size, setError, ...rest })
      }
      path = 'error'
      break

    case ChainId.VELAS:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]) {
        return getCustomLogo({ address, src: networkInfo.tokenLists[formattedAddress].logoURI, size, setError, ...rest })
      }
      path = `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/${isAddress(
        //todo namgold: fill this
        address
      )}/logo.png`
      break

    default:
      if (formattedAddress && networkInfo.tokenLists[formattedAddress]?.logoURI) {
        return getCustomLogo({
          address,
          chainId: networkInfo.chainId,
          src: networkInfo.tokenLists[formattedAddress].logoURI,
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
  return getCustomLogo({ address, chainId: networkInfo.chainId, src: path, size, setError, ...rest })
}
