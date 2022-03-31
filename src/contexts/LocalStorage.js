import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'

const KYBERSWAP = 'KYBERSWAP'

const VERSION = 'VERSION'
const CURRENT_VERSION = 1
const LAST_SAVED = 'LAST_SAVED'
const DISMISSED_PATHS = 'DISMISSED_PATHS'
const SAVED_ACCOUNTS = 'SAVED_ACCOUNTS'
const SAVED_TOKENS = 'SAVED_TOKENS'
const SAVED_PAIRS = 'SAVED_PAIRS'
const SAVED_POOLS = 'SAVED_POOLS'

const DARK_MODE = 'DARK_MODE'

const UPDATABLE_KEYS = [DARK_MODE, DISMISSED_PATHS, SAVED_ACCOUNTS, SAVED_PAIRS, SAVED_POOLS, SAVED_TOKENS]

const UPDATE_KEY = 'UPDATE_KEY'

const LocalStorageContext = createContext()

function useLocalStorageContext() {
  return useContext(LocalStorageContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE_KEY: {
      const { key, value } = payload
      if (!UPDATABLE_KEYS.some(k => k === key)) {
        throw Error(`Unexpected key in LocalStorageContext reducer: '${key}'.`)
      } else {
        return {
          ...state,
          [key]: value,
        }
      }
    }
    default: {
      throw Error(`Unexpected action type in LocalStorageContext reducer: '${type}'.`)
    }
  }
}

function init() {
  const defaultLocalStorage = {
    [VERSION]: CURRENT_VERSION,
    [DARK_MODE]: true,
    [DISMISSED_PATHS]: {},
    [SAVED_ACCOUNTS]: [],
    [SAVED_TOKENS]: {},
    [SAVED_PAIRS]: {},
    [SAVED_POOLS]: {},
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(KYBERSWAP))
    if (parsed[VERSION] !== CURRENT_VERSION) {
      // this is where we could run migration logic
      return defaultLocalStorage
    } else {
      return { ...defaultLocalStorage, ...parsed }
    }
  } catch {
    return defaultLocalStorage
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  const updateKey = useCallback((key, value) => {
    dispatch({ type: UPDATE_KEY, payload: { key, value } })
  }, [])

  return (
    <LocalStorageContext.Provider value={useMemo(() => [state, { updateKey }], [state, updateKey])}>
      {children}
    </LocalStorageContext.Provider>
  )
}

export function Updater() {
  const [state] = useLocalStorageContext()

  useEffect(() => {
    window.localStorage.setItem(KYBERSWAP, JSON.stringify({ ...state, [LAST_SAVED]: Math.floor(Date.now() / 1000) }))
  })

  return null
}

export function useDarkModeManager() {
  const [state, { updateKey }] = useLocalStorageContext()
  let isDarkMode = state[DARK_MODE]
  const toggleDarkMode = useCallback(
    value => {
      updateKey(DARK_MODE, value === false || value === true ? value : !isDarkMode)
    },
    [updateKey, isDarkMode]
  )
  return [isDarkMode, toggleDarkMode]
}

export function usePathDismissed(path) {
  const [state, { updateKey }] = useLocalStorageContext()
  const pathDismissed = state?.[DISMISSED_PATHS]?.[path]
  function dismiss() {
    let newPaths = state?.[DISMISSED_PATHS]
    newPaths[path] = true
    updateKey(DISMISSED_PATHS, newPaths)
  }

  return [pathDismissed, dismiss]
}

export function useSavedAccounts() {
  const [state, { updateKey }] = useLocalStorageContext()
  const savedAccounts =
    state?.[SAVED_ACCOUNTS]?.filter?.(Boolean).map(acc => ({ ...acc, address: acc.address?.toLowerCase?.() })) ?? []

  function addAccount(address, chainId) {
    address = address.toLowerCase()
    if (!savedAccounts.find(account => account.address === address && account.chainId === chainId)) {
      savedAccounts.push({ address, chainId })
      updateKey(SAVED_ACCOUNTS, savedAccounts)
    }
  }

  function removeAccount(address, chainId) {
    address = address.toLowerCase()
    let index = savedAccounts.findIndex(account => account.address === address && account.chainId === chainId)
    if (index > -1) {
      savedAccounts.splice(index, 1)
    }
    updateKey(SAVED_ACCOUNTS, savedAccounts)
  }

  return [savedAccounts, addAccount, removeAccount]
}

export function useSavedPairs() {
  const [state, { updateKey }] = useLocalStorageContext()
  const savedPairs = state?.[SAVED_PAIRS]

  function addPair(address, token0Address, token1Address, token0Symbol, token1Symbol, chainId) {
    let newList = state?.[SAVED_PAIRS]
    newList[address] = {
      address,
      token0Address,
      token1Address,
      token0Symbol,
      token1Symbol,
      chainId,
    }
    updateKey(SAVED_PAIRS, newList)
  }

  function removePair(address) {
    let newList = state?.[SAVED_PAIRS]
    delete newList[address]
    updateKey(SAVED_PAIRS, newList)
  }

  return [savedPairs, addPair, removePair]
}

export function useSavedPools() {
  const [state, { updateKey }] = useLocalStorageContext()
  const savedPools = state?.[SAVED_POOLS]

  function addPool(address, token0Address, token1Address, token0Symbol, token1Symbol, chainId) {
    let newList = state?.[SAVED_POOLS]
    newList[address] = {
      address,
      token0Address,
      token1Address,
      token0Symbol,
      token1Symbol,
      chainId,
    }
    updateKey(SAVED_POOLS, newList)
  }

  function removePool(address) {
    let newList = state?.[SAVED_POOLS]
    delete newList[address]
    updateKey(SAVED_POOLS, newList)
  }

  return [savedPools, addPool, removePool]
}

export function useSavedTokens() {
  const [state, { updateKey }] = useLocalStorageContext()
  const savedTokens = state?.[SAVED_TOKENS]

  function addToken(address, symbol, chainId) {
    let newList = state?.[SAVED_TOKENS]
    newList[address] = {
      symbol,
      chainId,
    }
    updateKey(SAVED_TOKENS, newList)
  }

  function removeToken(address) {
    let newList = state?.[SAVED_TOKENS]
    delete newList[address]
    updateKey(SAVED_TOKENS, newList)
  }

  return [savedTokens, addToken, removeToken]
}
