import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { useDarkModeManager } from '../../contexts/LocalStorage'

const pulse = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

const Wrapper = styled.div`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  ${(props) =>
    props.fill && !props.height
      ? css`
          height: 100vh;
        `
      : css`
          height: 180px;
        `}
`

const AnimatedImg = styled.div`
  animation: ${pulse} 800ms linear infinite;
  & > * {
    width: ${(props) => props.size ?? '120px'};
  }
`

const LocalLoader = ({ fill, size }) => {
  const [isDark] = useDarkModeManager()
  return (
    <Wrapper fill={fill}>
      <AnimatedImg size={size}>
        <img src={isDark ? '/logo-dark.svg' : '/logo.svg?version=v'} alt="loading-icon" />
      </AnimatedImg>
    </Wrapper>
  )
}

export default LocalLoader
