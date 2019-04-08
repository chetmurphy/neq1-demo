import * as React from 'react'

interface IArrowKeys {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

const arrowKeysInitialState: IArrowKeys = {
  up: false,
  down: false,
  left: false,
  right: false
}

type ArrowKeysAction =
  | 'setArrowDown'
  | 'clearArrowDown'
  | 'setArrowUp'
  | 'clearArrowUp'
  | 'setArrowLeft'
  | 'clearArrowLeft'
  | 'setArrowRight'
  | 'clearArrowRight'

interface IArrowKeysAction {
  type: ArrowKeysAction
}

const reducer: React.Reducer<IArrowKeys, IArrowKeysAction> = (
  state: IArrowKeys,
  action: IArrowKeysAction
) => {
  switch (action.type) {
    case 'setArrowDown':
      return { ...state, down: true }
    case 'clearArrowDown':
      return { ...state, down: false }
    case 'setArrowUp':
      return { ...state, up: true }
    case 'clearArrowUp':
      return { ...state, up: false }
    case 'setArrowLeft':
      return { ...state, left: true }
    case 'clearArrowLeft':
      return { ...state, left: false }
    case 'setArrowRight':
      return { ...state, right: true }
    case 'clearArrowRight':
      return { ...state, right: false }

    default:
      throw new Error(`Unexpected unexpected ArrowKeys action: ${action.type}`)
  }
}

export function useArrowKeysMap() {
  const [arrowKeysMap, setArrowKeysMap] = React.useReducer(
    reducer,
    arrowKeysInitialState
  )

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (e.repeat) {
        return
      }

      if (e && e.key === 'ArrowUp') {
        setArrowKeysMap({ type: 'setArrowUp' })
      }
      if (e && e.key === 'ArrowDown') {
        setArrowKeysMap({ type: 'setArrowDown' })
      }
      if (e && e.key === 'ArrowLeft') {
        setArrowKeysMap({ type: 'setArrowLeft' })
      }
      if (e && e.key === 'ArrowRight') {
        setArrowKeysMap({ type: 'setArrowRight' })
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (e.repeat) {
        return
      }

      if (e && e.key === 'ArrowUp') {
        setArrowKeysMap({ type: 'clearArrowUp' })
      }
      if (e && e.key === 'ArrowDown') {
        setArrowKeysMap({ type: 'clearArrowDown' })
      }
      if (e && e.key === 'ArrowLeft') {
        setArrowKeysMap({ type: 'clearArrowLeft' })
      }
      if (e && e.key === 'ArrowRight') {
        setArrowKeysMap({ type: 'clearArrowRight' })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return arrowKeysMap
}
