import { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useHistory, useParams } from 'react-router-dom'

export default function GoogleAnalyticsReporter() {
  const { network: currentNetworkURL } = useParams()
  const prefixNetworkURL = currentNetworkURL ? `/${currentNetworkURL}` : ''
  const history = useHistory()

  let currentUrl = currentNetworkURL
    ? history.location.pathname.split('/').slice(2).join('/')
    : history.location.pathname.split('/').slice(1).join('/')

  useEffect(() => {
    ReactGA.pageview('analytics/' + prefixNetworkURL + '/' + currentUrl)
  }, [prefixNetworkURL, currentUrl])

  return null
}
