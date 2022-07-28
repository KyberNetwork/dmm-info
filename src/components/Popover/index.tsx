import { Placement } from '@popperjs/core'
import { transparentize } from 'polished'
import React, { useState } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'
import Portal from '@reach/portal'
import useInterval from '../../hooks'

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 99999;

  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;

  background: ${({ theme }) => theme.tableHeader};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.9, theme.shadow1)};
  color: ${({ theme }) => theme.text2};
  border-radius: 8px;
`

const ReferenceElement = styled.div<{ width?: string }>`
  display: inline-block;
  ${({ width }) => width && `width: ${width};`}
`

const Arrow = styled.div`
  width: 8px;
  height: 8px;
  z-index: 9998;

  ::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 9998;

    content: '';
    border: 1px solid ${({ theme }) => theme.border};
    transform: rotate(45deg);
    background: ${({ theme }) => theme.tableHeader};
  }

  &.arrow-top {
    bottom: -5px;
    ::before {
      border-top: none;
      border-left: none;
    }
  }

  &.arrow-bottom {
    top: -5px;
    ::before {
      border-bottom: none;
      border-right: none;
    }
  }

  &.arrow-left {
    right: -5px;

    ::before {
      border-bottom: none;
      border-left: none;
    }
  }

  &.arrow-right {
    left: -5px;
    ::before {
      border-right: none;
      border-top: none;
    }
  }
`

export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  children: React.ReactNode
  placement?: Placement
  width?: string
}

export default function Popover({ width, content, show, children, placement = 'auto' }: PopoverProps): JSX.Element {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
      { name: 'arrow', options: { element: arrowElement } },
    ],
  })

  useInterval(update, show ? 100 : null)

  return (
    <>
      <ReferenceElement ref={setReferenceElement} width={width}>
        {children}
      </ReferenceElement>
      <Portal>
        <PopoverContainer show={show} ref={setPopperElement} style={styles.popper} {...attributes.popper}>
          {content}
          <Arrow
            className={`arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
            ref={setArrowElement}
            style={styles.arrow}
            {...attributes.arrow}
          />
        </PopoverContainer>
      </Portal>
    </>
  )
}
