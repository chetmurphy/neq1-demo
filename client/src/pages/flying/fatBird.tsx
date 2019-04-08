import * as React from 'react'

import { Block } from 'react-layout-generator'

import { useArrowKeysMap } from './useArrowKeysMap'

export function useFatBird(block: Block) {
  const style: React.CSSProperties = {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    MozUserSelect: 'none',
    width: 70,
    height: 60
  }

  const arrowKeys = useArrowKeysMap()

  const r = block.rect

  React.useEffect(() => {
    const speed = 3
    if (arrowKeys.up) {
      r.y -= speed
    }
    if (arrowKeys.down) {
      r.y += speed
    }
    if (arrowKeys.left) {
      r.x -= speed
    }
    if (arrowKeys.right) {
      r.x += speed
    }

    block.update(r)

  })

  const [cycle, setCycle] = React.useState(0)
  React.useEffect(() => {
    let timerStop: any

    function updateCount() {
      setCycle((cycle + 1) % 8)
    }
    
    timerStop = setTimeout(()=>updateCount(), 25)

    return() => {
      clearTimeout(timerStop);
    };

  }, [cycle])

  function frame(id: number) {
    return require(`../../assets/fatBird/frame-${id + 1}.png`)
  }

  return (
    <img
      id={`frame-${cycle + 1}`}
      key={`frame-${cycle + 1}`}
      src={frame(cycle)}
      style={style}
    />
  )
}


interface IProps {
  block: Block
}

// tslint:disable-next-line:variable-name
export const RenderFatBird: React.FunctionComponent<IProps> = ({
  block
}: IProps): JSX.Element => {
  const child = useFatBird(block)
  return <div>{child}</div>
}
