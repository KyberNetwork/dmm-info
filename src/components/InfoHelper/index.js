import React, { useCallback, useState } from 'react'
import { Info } from 'react-feather'
import styled from 'styled-components'
import Tooltip from '../Tooltip'

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  color: ${({ theme }) => theme.subText};

  :hover,
  :focus {
    opacity: 0.7;
  }
`

const LightInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.white};

  :hover,
  :focus {
    opacity: 0.7;
  }
`

const InfoMark = styled.span`
  font-size: 1rem;
`

export default function InfoHelper({ text }) {
  const [show, setShow] = useState(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <InfoWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <Info size={16} />
        </InfoWrapper>
      </Tooltip>
    </span>
  )
}

export function LightInfoHelper({ text }) {
  const [show, setShow] = useState(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <LightInfoWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <InfoMark>?</InfoMark>
        </LightInfoWrapper>
      </Tooltip>
    </span>
  )
}
