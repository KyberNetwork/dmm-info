import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalData } from '../../contexts/GlobalData'
import { formattedNum, localNumber, formatBigLiquidity } from '../../utils'
import { Flex, Text } from 'rebass'
import useTheme from '../../hooks/useTheme'
import useAggregatorVolume from '../../hooks/useAggregatorVolume'
import { ButtonEmpty } from '../ButtonStyled'
import { Loader } from 'react-feather'
import { useMedia } from 'react-use'
import { aggregateGlobalData } from '../../utils/aggregateData'
import QuestionHelper from '../QuestionHelper'

const Stats = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  padding: 16px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  flex: 1;
`

const Separator = styled.span`
  user-select: none;
  font-size: 12px;
`

export default function GlobalStats() {
  const globalDatas = useGlobalData()
  const { oneDayTxns, oneDayFeeUSD, oneDayFeeChange, txnChange } = globalDatas[1]
    ? aggregateGlobalData(globalDatas)
    : globalDatas[0] || {}
  const oneDayFees = oneDayFeeUSD ? formattedNum(oneDayFeeUSD, true) : '0'
  const theme = useTheme()
  const aggregatorVolume = useAggregatorVolume()
  const above800 = useMedia('(min-width: 800px)')

  // ALL || 24H
  const [tradingVolumeType, setTradingVolumeType] = useState('ALL')

  return (
    <Flex sx={{ gap: above800 ? '32px' : '16px' }} flexDirection={above800 ? 'row' : 'column'}>
      <Stats>
        <Flex alignItems='center' justifyContent='space-between'>
          <Flex alignItems='center' justifyContent='space-between'>
            <Text color={theme.subText} fontSize='12px'>
              Trading Volume
            </Text>
            <QuestionHelper text={'Total trading volume through aggregator and liquidity pools on all chains'} />
          </Flex>

          <Flex sx={{ gap: '4px' }}>
            <ButtonEmpty sx={{ padding: '0 !important' }} onClick={() => setTradingVolumeType('ALL')} border='none'>
              <Text color={tradingVolumeType === 'ALL' ? theme.green1 : theme.subText} fontSize='12px' fontWeight='500'>
                All time
              </Text>
            </ButtonEmpty>
            <Separator>|</Separator>
            <ButtonEmpty sx={{ padding: '0 !important' }} onClick={() => setTradingVolumeType('24H')} border='none'>
              <Text color={tradingVolumeType === '24H' ? theme.green1 : theme.subText} fontSize='12px' fontWeight='500'>
                24H
              </Text>
            </ButtonEmpty>
          </Flex>
        </Flex>

        <Text fontSize='18px' fontWeight='500' marginTop='8px'>
          {aggregatorVolume ? (
            formatBigLiquidity(
              tradingVolumeType === 'ALL' ? aggregatorVolume.totalVolume : aggregatorVolume.last24hVolume,
              2,
              true
            )
          ) : (
            <Loader />
          )}
        </Text>
      </Stats>
      <Stats>
        <Text color={theme.subText} fontSize='12px'>
          Fees (24H)
        </Text>
        <Flex justifyContent='space-between' marginTop='8px' alignItems='center'>
          <Text fontSize='18px' fontWeight='500'>
            {oneDayFees}
          </Text>
          <Text fontSize='12px' color={oneDayFeeChange > 0 ? theme.primary : theme.red1}>
            {oneDayFeeChange ? oneDayFeeChange.toFixed(2) : '-'}%
          </Text>
        </Flex>
      </Stats>
      <Stats>
        <Text color={theme.subText} fontSize='12px'>
          Transactions (24H)
        </Text>
        <Flex justifyContent='space-between' marginTop='8px' alignItems='center'>
          <Text fontSize='18px' fontWeight='500'>
            {localNumber(oneDayTxns)}
          </Text>
          <Text fontSize='12px' color={txnChange > 0 ? theme.primary : theme.red1}>
            {txnChange ? txnChange.toFixed(2) : '-'}%
          </Text>
        </Flex>
      </Stats>
    </Flex>
  )
}
