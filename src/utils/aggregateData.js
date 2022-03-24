import { get2DayPercentChange, getPercentChange } from '.'

export const flatObjectArray = objectsArray => {
  const result = {}
  objectsArray.forEach(object => {
    Object.keys(object).forEach(key => {
      result[key] = object[key]
    })
  })
  return result
}

export const aggregateLps = lpsArray => {
  return lpsArray.filter(Boolean).flat(1)
}

export const aggregateGlobalTxns = txnsArray => {
  const result = { mints: [], burns: [], swaps: [] }
  txnsArray.forEach(txnsObject => {
    result.mints.push(...(txnsObject?.mints || []))
    result.burns.push(...(txnsObject?.burns || []))
    result.swaps.push(...(txnsObject?.swaps || []))
  })
  return result
}

export const aggregateChartData = globalDataArray => {
  //getChartData
  const hashtableId_Data = {}

  const add = (target, value) => {
    const addField = key => {
      if (!value?.[key]) return
      if (!target[key]) target[key] = 0
      target[key] += parseFloat(value[key])
    }
    addField('dailyVolumeUSD', value)
    addField('totalLiquidityUSD', value)
    addField('totalVolumeUSD', value)
    addField('weeklyVolumeUSD', value)
  }

  globalDataArray.forEach(globalData => {
    if (globalData) {
      globalData.forEach(dayData => {
        const target = hashtableId_Data[dayData.date] || {}
        add(target, dayData)
        target.id = dayData.id
        target.date = dayData.date
        hashtableId_Data[dayData.date] = target
      })
    }
  })
  const result = Object.values(hashtableId_Data)
  return result
}

export const aggregateGlobalData = globalDataArray => {
  const result = { oneDayData: {}, twoDayData: {}, oneWeekData: {}, twoWeekData: {} }
  const add = (target, value) => {
    const addField = key => {
      if (!value?.[key]) return
      if (!target[key]) target[key] = 0
      target[key] += parseFloat(value[key])
    }
    addField('totalVolumeUSD', value)
    addField('totalFeeUSD', value)
    addField('untrackedVolumeUSD', value)
    addField('totalLiquidityUSD', value)
    addField('txCount', value)
    addField('pairCount', value)
  }

  globalDataArray.forEach(globalData => {
    if (globalData) {
      add(result, globalData)
      add(result.oneDayData, globalData.oneDayData)
      add(result.twoDayData, globalData.twoDayData)
      add(result.oneWeekData, globalData.oneWeekData)
      add(result.twoWeekData, globalData.twoWeekData)
    }
  })
  calculateValuesOnGlobalData(result)
  return result
}

export const calculateValuesOnGlobalData = data => {
  if (data) {
    let [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
      data.totalVolumeUSD ?? 0,
      data.oneDayData?.totalVolumeUSD ?? 0,
      data.twoDayData?.totalVolumeUSD ?? 0
    )

    let [oneDayFeeUSD, oneDayFeeChange] = get2DayPercentChange(
      data.totalFeeUSD ?? 0,
      data.oneDayData?.totalFeeUSD ?? 0,
      data.twoDayData?.totalFeeUSD ?? 0
    )

    const [oneDayTxns, txnChange] = get2DayPercentChange(
      data.txCount ?? 0,
      data.oneDayData?.txCount ?? 0,
      data.twoDayData?.txCount ?? 0
    )

    const liquidityChangeUSD = getPercentChange(data?.totalLiquidityUSD ?? 0, data.oneDayData?.totalLiquidityUSD ?? 0)

    data.oneDayVolumeUSD = oneDayVolumeUSD
    data.volumeChangeUSD = volumeChangeUSD
    data.oneDayFeeUSD = oneDayFeeUSD
    data.oneDayFeeChange = oneDayFeeChange
    data.liquidityChangeUSD = liquidityChangeUSD
    data.oneDayTxns = oneDayTxns
    data.txnChange = txnChange
  }

  if (data.oneWeekData && data.twoWeekData) {
    const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
      data.totalVolumeUSD ?? 0,
      data.oneWeekData?.totalVolumeUSD ?? 0,
      data.twoWeekData?.totalVolumeUSD ?? 0
    )
    data.oneWeekVolume = oneWeekVolume
    data.weeklyVolumeChange = weeklyVolumeChange
  }
}

// {
//   "data": {
//     "dmmDayDatas": [
//       {
//         "__typename": "DmmDayData",
//         "id": "19059",
//         "date": 1646697600,

//         "dailyVolumeETH": "0",
//         "dailyVolumeUSD": "0",
//         "totalLiquidityETH": "0",
//         "totalLiquidityUSD": "0",
//         "totalVolumeUSD": "0"
//       }
//     ]
//   }
// }

// {
//   "id": "0x5f1fe642060b5b9658c15721ea22e982643c095c",
//   "totalVolumeUSD": "1120493287.698824640576757222703006",
//   "totalFeeUSD": "2599468.601592519649082589076908392",
//   "untrackedVolumeUSD": "1176738240.895777460954865444537508",
//   "totalLiquidityUSD": 20947884.5790311,
//   "totalLiquidityETH": "14117682.46539278284396139682605648",
//   "txCount": "2247995",
//   "pairCount": 199,
//   "__typename": "DmmFactory",
//   "oneDayVolumeUSD": 4656557.555687666,
//   "volumeChangeUSD": -7.024501751133099,
//   "oneDayFeeUSD": 6300.770075035747,
//   "oneDayFeeChange": -40.056420346895884,
//   "liquidityChangeUSD": 0.2708434901131414,
//   "oneDayTxns": 20599,
//   "txnChange": -12.999957764919543,
//   "oneWeekVolume": 23885075.918694735,
//   "weeklyVolumeChange": 52.943897666962535
// }
