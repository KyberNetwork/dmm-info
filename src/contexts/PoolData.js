import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect, useState } from 'react'
import merge from 'deepmerge'

import {
  POOL_DATA,
  POOL_CHART,
  FILTERED_TRANSACTIONS_POOL,
  POOLS_CURRENT,
  POOLS_BULK,
  POOLS_HISTORICAL_BULK,
  HOURLY_POOL_RATES,
} from '../apollo/queries'

import { useEthPrice } from './GlobalData'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import {
  getPercentChange,
  get2DayPercentChange,
  isAddress,
  getBlocksFromTimestamps,
  getTimestampsForChanges,
  splitQuery,
  overwriteArrayMerge,
  memoRequest,
} from '../utils'

import { timeframeOptions } from '../constants'
import { useExchangeClients, useLatestBlocks } from './Application'
import { useNetworksInfo } from './NetworkInfo'

const UPDATE = 'UPDATE'
const UPDATE_POOL_TXNS = 'UPDATE_POOL_TXNS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_TOP_POOLS = 'UPDATE_TOP_POOLS'
const UPDATE_HOURLY_DATA = 'UPDATE_HOURLY_DATA'

dayjs.extend(utc)

export function safeAccess(object, path) {
  return object
    ? path.reduce(
        (accumulator, currentValue) => (accumulator && accumulator[currentValue] ? accumulator[currentValue] : null),
        object
      )
    : null
}

const PoolDataContext = createContext()

function usePoolDataContext() {
  return useContext(PoolDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { poolAddress, data, chainId } = payload
      if (!data) return state
      return merge(state, { [chainId]: { [poolAddress]: data } })
    }

    case UPDATE_TOP_POOLS: {
      const { topPools, chainId } = payload
      let added = {}
      topPools && topPools.forEach(pool => (added[pool.id] = pool))
      return merge(state, { [chainId]: added })
    }

    case UPDATE_POOL_TXNS: {
      const { address, transactions, chainId } = payload
      return merge(state, { [chainId]: { [address]: { txns: transactions } } }, { arrayMerge: overwriteArrayMerge })
    }

    case UPDATE_CHART_DATA: {
      const { address, chartData, chainId } = payload
      return merge(state, { [chainId]: { [address]: { chartData } } }, { arrayMerge: overwriteArrayMerge })
    }

    case UPDATE_HOURLY_DATA: {
      const { address, hourlyData, timeWindow, chainId } = payload
      return merge(
        state,
        { [chainId]: { [address]: { hourlyData: { [timeWindow]: hourlyData } } } },
        { arrayMerge: overwriteArrayMerge }
      )
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})

  // update pool specific data
  const update = useCallback((poolAddress, data, chainId) => {
    dispatch({
      type: UPDATE,
      payload: {
        poolAddress,
        data,
        chainId,
      },
    })
  }, [])

  const updateTopPools = useCallback((topPools, chainId) => {
    dispatch({
      type: UPDATE_TOP_POOLS,
      payload: {
        topPools,
        chainId,
      },
    })
  }, [])

  const updatePoolTxns = useCallback((address, transactions, chainId) => {
    dispatch({
      type: UPDATE_POOL_TXNS,
      payload: { address, transactions, chainId },
    })
  }, [])

  const updateChartData = useCallback((address, chartData, chainId) => {
    dispatch({
      type: UPDATE_CHART_DATA,
      payload: { address, chartData, chainId },
    })
  }, [])

  const updateHourlyData = useCallback((address, hourlyData, timeWindow, chainId) => {
    dispatch({
      type: UPDATE_HOURLY_DATA,
      payload: { address, hourlyData, timeWindow, chainId },
    })
  }, [])

  return (
    <PoolDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updatePoolTxns,
            updateChartData,
            updateTopPools,
            updateHourlyData,
          },
        ],
        [state, update, updatePoolTxns, updateChartData, updateTopPools, updateHourlyData]
      )}
    >
      {children}
    </PoolDataContext.Provider>
  )
}

export async function getBulkPoolData(client, poolList, ethPrice, networkInfo) {
  const [t1, t2, tWeek] = getTimestampsForChanges()
  let b1, b2, bWeek
  try {
    ;[{ number: b1 }, { number: b2 }, { number: bWeek }] = await getBlocksFromTimestamps([t1, t2, tWeek], networkInfo)
  } catch (e) {
    console.error('Cant get block data from ' + networkInfo.subgraphBlockUrl)
    return
  }

  try {
    let current = await client.query({
      query: POOLS_BULK,
      variables: {
        allPools: poolList,
      },
      fetchPolicy: 'network-only',
    })

    let [oneDayResult, twoDayResult, oneWeekResult] = await Promise.all(
      [b1, b2, bWeek].map(async block => {
        let result = client.query({
          query: POOLS_HISTORICAL_BULK(block, poolList),
          fetchPolicy: 'network-only',
        })
        return result
      })
    )

    let oneDayData = oneDayResult?.data?.pools.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let twoDayData = twoDayResult?.data?.pools.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let oneWeekData = oneWeekResult?.data?.pools.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur }
    }, {})

    let poolData = await Promise.all(
      current &&
        current.data.pools.map(async pool => {
          let data = pool
          let oneDayHistory = oneDayData?.[pool.id]
          if (!oneDayHistory) {
            let newData = await client.query({
              query: POOL_DATA(pool.id, b1),
              fetchPolicy: 'network-only',
            })
            oneDayHistory = newData.data.pools[0]
          }
          let twoDayHistory = twoDayData?.[pool.id]
          if (!twoDayHistory) {
            let newData = await client.query({
              query: POOL_DATA(pool.id, b2),
              fetchPolicy: 'network-only',
            })
            twoDayHistory = newData.data.pools[0]
          }
          let oneWeekHistory = oneWeekData?.[pool.id]
          if (!oneWeekHistory) {
            let newData = await client.query({
              query: POOL_DATA(pool.id, bWeek),
              fetchPolicy: 'network-only',
            })
            oneWeekHistory = newData.data.pools[0]
          }
          data = parseData(data, oneDayHistory, twoDayHistory, oneWeekHistory, ethPrice, b1, networkInfo)
          return data
        })
    )

    return poolData
  } catch (e) {
    console.log(e)
  }
}

function parseData(data, oneDayData, twoDayData, oneWeekData, ethPrice, oneDayBlock, networkInfo) {
  // get volume changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
    data?.volumeUSD,
    oneDayData?.volumeUSD ? oneDayData.volumeUSD : 0,
    twoDayData?.volumeUSD ? twoDayData.volumeUSD : 0
  )

  const [oneDayFeeUSD] = get2DayPercentChange(
    data?.feeUSD,
    oneDayData?.feeUSD ? oneDayData.feeUSD : 0,
    twoDayData?.feeUSD ? twoDayData.feeUSD : 0
  )
  const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
    data?.untrackedVolumeUSD,
    oneDayData?.untrackedVolumeUSD ? parseFloat(oneDayData?.untrackedVolumeUSD) : 0,
    twoDayData?.untrackedVolumeUSD ? twoDayData?.untrackedVolumeUSD : 0
  )
  const [oneDayFeeUntracked] = get2DayPercentChange(
    data?.untrackedFeeUSD,
    oneDayData?.untrackedFeeUSD ? parseFloat(oneDayData?.untrackedFeeUSD) : 0,
    twoDayData?.untrackedFeeUSD ? twoDayData?.untrackedFeeUSD : 0
  )
  const oneWeekVolumeUSD = parseFloat(oneWeekData ? data?.volumeUSD - oneWeekData?.volumeUSD : data.volumeUSD)

  // set volume properties
  data.oneDayVolumeUSD = parseFloat(oneDayVolumeUSD)
  data.oneWeekVolumeUSD = oneWeekVolumeUSD
  data.oneDayFeeUSD = oneDayFeeUSD
  data.oneDayFeeUntracked = oneDayFeeUntracked
  data.volumeChangeUSD = volumeChangeUSD
  data.oneDayVolumeUntracked = oneDayVolumeUntracked
  data.volumeChangeUntracked = volumeChangeUntracked

  // set liquiditry properties
  data.trackedReserveUSD = data.trackedReserveETH * ethPrice
  data.liquidityChangeUSD = getPercentChange(data.reserveUSD, oneDayData?.reserveUSD)

  // format if pool hasnt existed for a day or a week
  if (!oneDayData && data && data.createdAtBlockNumber > oneDayBlock) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD)
  }
  if (!oneDayData && data) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD)
  }
  if (!oneWeekData && data) {
    data.oneWeekVolumeUSD = parseFloat(data.volumeUSD)
  }
  if (data?.token0?.id === networkInfo.wethAddress) {
    data.token0.name = networkInfo.nativeTokenWrappedName
    data.token0.symbol = networkInfo.nativeTokenSymbol
  }
  if (data?.token1?.id === networkInfo.wethAddress) {
    data.token1.name = networkInfo.nativeTokenWrappedName
    data.token1.symbol = networkInfo.nativeTokenSymbol
  }

  return data
}

const getPoolTransactions = async (client, poolAddress) => {
  const transactions = {}

  try {
    let result = await client.query({
      query: FILTERED_TRANSACTIONS_POOL,
      variables: {
        allPools: [poolAddress],
      },
      fetchPolicy: 'no-cache',
    })
    transactions.mints = result.data.mints
    transactions.burns = result.data.burns
    transactions.swaps = result.data.swaps
  } catch (e) {
    console.log(e)
  }

  return transactions
}

const getPoolChartData = async (client, poolAddress) => {
  let data = []
  const utcEndTime = dayjs.utc()
  let utcStartTime = utcEndTime.subtract(1, 'year').startOf('minute')
  let startTime = utcStartTime.unix() - 1

  try {
    let allFound = false
    let skip = 0
    while (!allFound) {
      let result = await client.query({
        query: POOL_CHART,
        variables: {
          poolAddress: poolAddress,
          skip,
        },
        fetchPolicy: 'cache-first',
      })
      skip += 1000
      data = data.concat(result.data.poolDayDatas)
      if (result.data.poolDayDatas.length < 1000) {
        allFound = true
      }
    }

    let dayIndexSet = new Set()
    let dayIndexArray = []
    const oneDay = 24 * 60 * 60
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0))
      dayIndexArray.push(data[i])
      dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD)
      dayData.reserveUSD = parseFloat(dayData.reserveUSD)
    })

    if (data[0]) {
      // fill in empty days
      let timestamp = data[0].date ? data[0].date : startTime
      let latestLiquidityUSD = data[0].reserveUSD
      let index = 1
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay
        let currentDayIndex = (nextDay / oneDay).toFixed(0)
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dayString: nextDay,
            dailyVolumeUSD: 0,
            reserveUSD: latestLiquidityUSD,
          })
        } else {
          latestLiquidityUSD = dayIndexArray[index].reserveUSD
          index = index + 1
        }
        timestamp = nextDay
      }
    }

    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
  } catch (e) {
    console.log(e)
  }

  return data
}

const getHourlyRateData = async (client, poolAddress, startTime, latestBlock, frequency, networksInfo) => {
  try {
    const utcEndTime = dayjs.utc()
    let time = startTime

    // create an array of hour start times until we reach current hour
    const timestamps = []
    while (time <= utcEndTime.unix() - frequency) {
      timestamps.push(time)
      time += frequency
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      return []
    }

    // once you have all the timestamps, get the blocks for each timestamp in a bulk query
    let blocks

    blocks = await getBlocksFromTimestamps(timestamps, networksInfo, 100)

    // catch failing case
    if (!blocks || blocks?.length === 0) {
      return []
    }

    if (latestBlock) {
      blocks = blocks.filter(b => {
        return parseFloat(b.number) <= parseFloat(latestBlock)
      })
    }

    const result = await splitQuery(HOURLY_POOL_RATES, client, [poolAddress], blocks, 100)

    // format token ETH price results
    let values = []
    for (var row in result) {
      let timestamp = row.split('t')[1]
      if (timestamp) {
        values.push({
          timestamp,
          rate0: parseFloat(result[row]?.token0Price),
          rate1: parseFloat(result[row]?.token1Price),
        })
      }
    }

    let formattedHistoryRate0 = []
    let formattedHistoryRate1 = []

    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistoryRate0.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].rate0),
        close: parseFloat(values[i + 1].rate0),
      })
      formattedHistoryRate1.push({
        timestamp: values[i].timestamp,
        open: parseFloat(values[i].rate1),
        close: parseFloat(values[i + 1].rate1),
      })
    }

    return [formattedHistoryRate0, formattedHistoryRate1]
  } catch (e) {
    console.log(e)
    return [[], []]
  }
}

export function Updater() {
  const exchangeSubgraphClient = useExchangeClients()
  const [state, { updateTopPools }] = usePoolDataContext()
  const [ethPrice] = useEthPrice()
  const [networksInfo] = useNetworksInfo()

  useEffect(() => {
    async function getData(index) {
      // get top pools by reserves
      let {
        data: { pools },
      } = await exchangeSubgraphClient[index].query({
        query: POOLS_CURRENT,
        fetchPolicy: 'cache-first',
      })

      // format as array of addresses
      const formattedPools = pools.map(pool => pool.id).filter(poolId => !state[networksInfo[index].chainId]?.[poolId])
      if (!formattedPools.length) return
      // get data for every pool in list
      let topPools = await getBulkPoolData(exchangeSubgraphClient[index], formattedPools, ethPrice[index], networksInfo[index])
      topPools?.forEach(topPool => (topPool.chainId = networksInfo[index].chainId))
      topPools && updateTopPools(topPools, networksInfo[index].chainId)
    }
    networksInfo.forEach((networkInfo, index) => {
      if (ethPrice[index]) {
        memoRequest(() => getData(index), 'UpdaterPoolData_' + networkInfo.chainId + '_' + ethPrice[index], 10000)
      }
    })
  }, [ethPrice, updateTopPools, exchangeSubgraphClient, networksInfo])
  return null
}

export function useHourlyRateData(poolAddress, timeWindow, frequency) {
  const [exchangeSubgraphClient] = useExchangeClients()
  const [state, { updateHourlyData }] = usePoolDataContext()
  const [[latestBlock]] = useLatestBlocks()
  const [[networkInfo]] = useNetworksInfo()
  const chartData = state?.[networkInfo.chainId]?.[poolAddress]?.hourlyData?.[timeWindow]

  useEffect(() => {
    const currentTime = dayjs.utc()
    let startTime

    switch (timeWindow) {
      case timeframeOptions.FOUR_HOURS:
        startTime = currentTime.subtract(4, 'hour').startOf('second').unix()
        break
      case timeframeOptions.ONE_DAY:
        startTime = currentTime.subtract(1, 'day').startOf('minute').unix()
        break
      case timeframeOptions.THERE_DAYS:
        startTime = currentTime.subtract(3, 'day').startOf('hour').unix()
        break
      case timeframeOptions.WEEK:
        startTime = currentTime.subtract(1, 'week').startOf('hour').unix()
        break
      case timeframeOptions.MONTH:
        startTime = currentTime.subtract(1, 'month').startOf('hour').unix()
        break
      default:
        startTime = currentTime.subtract(3, 'day').startOf('hour').unix()
        break
    }

    async function fetch() {
      let data = await getHourlyRateData(exchangeSubgraphClient, poolAddress, startTime, latestBlock, frequency, networkInfo)
      updateHourlyData(poolAddress, data, timeWindow, networkInfo.chainId)
    }
    if (!chartData) {
      fetch()
    }
  }, [chartData, timeWindow, poolAddress, updateHourlyData, latestBlock, frequency, exchangeSubgraphClient, networkInfo])

  return chartData
}

/**
 * Get all the current and 24hr changes for a pool
 */
export function usePoolData(poolAddress) {
  const [exchangeSubgraphClient] = useExchangeClients()
  const [state, { update }] = usePoolDataContext()
  const [[ethPrice]] = useEthPrice()
  const [[networkInfo]] = useNetworksInfo()
  const [error, setError] = useState(false)
  const poolData = state?.[networkInfo.chainId]?.[poolAddress]

  useEffect(() => {
    setError(false)
  }, [poolAddress, networkInfo])

  useEffect(() => {
    let cancelled = false
    async function fetchData() {
      try {
        let data = await getBulkPoolData(exchangeSubgraphClient, [poolAddress], ethPrice, networkInfo)
        if (cancelled) return
        data?.length ? update(poolAddress, data[0], networkInfo.chainId) : setError(true)
      } catch (e) {
        if (cancelled) return
        setError(true)
      }
    }
    if (!poolData && !error) {
      if (poolAddress && ethPrice && isAddress(poolAddress)) {
        fetchData()
      } else {
        setError(true)
      }
    }
    return () => (cancelled = true)
  }, [poolAddress, poolData, update, ethPrice, exchangeSubgraphClient, networkInfo, error])

  return error ? { error: true } : poolData || {}
}

/**
 * Get most recent txns for a pool
 */
export function usePoolTransactions(poolAddress) {
  const [exchangeSubgraphClient] = useExchangeClients()
  const [state, { updatePoolTxns }] = usePoolDataContext()
  const [[networkInfo]] = useNetworksInfo()
  const poolTxns = state?.[networkInfo.chainId]?.[poolAddress]?.txns
  useEffect(() => {
    async function checkForTxns() {
      if (!poolTxns) {
        let transactions = await getPoolTransactions(exchangeSubgraphClient, poolAddress)
        transactions.burns?.forEach(burn => (burn.chainId = networkInfo.chainId))
        transactions.mints?.forEach(mint => (mint.chainId = networkInfo.chainId))
        transactions.swaps?.forEach(swap => (swap.chainId = networkInfo.chainId))
        if (transactions.burns?.length || transactions.mints?.length || transactions.swaps?.length)
          updatePoolTxns(poolAddress, transactions, networkInfo.chainId)
      }
    }
    checkForTxns()
  }, [poolTxns, poolAddress, updatePoolTxns, exchangeSubgraphClient, networkInfo.chainId])
  return poolTxns
}

export function usePoolChartData(poolAddress) {
  const [exchangeSubgraphClient] = useExchangeClients()
  const [state, { updateChartData }] = usePoolDataContext()
  const [[networkInfo]] = useNetworksInfo()
  const chartData = state?.[networkInfo.chainId]?.[poolAddress]?.chartData

  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        let data = await getPoolChartData(exchangeSubgraphClient, poolAddress)
        data && updateChartData(poolAddress, data, networkInfo.chainId)
      }
    }
    checkForChartData()
  }, [chartData, poolAddress, updateChartData, exchangeSubgraphClient, networkInfo.chainId])
  return chartData
}

/**
 * Get list of all pools in Kyberswap
 */
export function useAllPoolData() {
  const [state] = usePoolDataContext()
  const [networksInfo] = useNetworksInfo()
  return networksInfo.map(networkInfo => state?.[networkInfo.chainId] || {})
}
