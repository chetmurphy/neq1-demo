# Simple layered game

The goal of this game is fly the fat bird through the cavern by raising or lowing the bird's position using the up/down arrow keys without colliding with the stalagmites.

This is game is implemented using two pathHooks. One for the bottom and one for the top. Here is the hook for the stalagmites that come up from the floor. The definition for the hanging stalagmites is similar.

```ts
hooks.set(
  "flightBottom",
  pathHook({
    prefix: "flightBottom",
    points: [
      {
        min: 0,
        max: 2500,
        points: [{ x: '110%', y: '100%' }, { x: "-10%", y: '100%'  }]
      }
    ],
    input: () => blocks.layers(2),
    update: this._flowFlightBottom,
    output: this._flowFlightBottom,
    velocity: 0.05,
    spacing: 200,
    fill: true,
    g: this._g
  })
);
```

The Layout is shown below.

```ts
<Layout
  name={"Layout.intro.example"}
  service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
  animate={{ active: true }}
  g={this._g}
  overflowX={OverflowOptions.hidden}
  overflowY={OverflowOptions.hidden}
>
  {this.content()}
</Layout>
```

And the blocks themselves are of the form:

```ts
<div
  key={name}
  data-layout={{
    name,
    location: { left: i*10, top: 0, width: '10%', height: v },
    layer: 1
  }}
  style={{backgroundColor: 'coral', borderStyle: 'solid', borderColor: 'black', borderWidth: 1}}
/>
```

Finally the sprite itself is implemented using the new React hooks in a custom component that responds to up/down arrow keys. Note that the hook is responsible for both moving the fat bird as well as flapping its wings.

```ts
function useFatBird(block: Block) {
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
```