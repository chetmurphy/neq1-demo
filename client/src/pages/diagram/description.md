### Diagrams Implementation

This page is an example of building a diagram with connected lines. The nodes are HTML and the lines are svg.

If you turn on edit (the top most icon in the toolBar), then you can move the blocks and the connections will follow.

Each node is of the form:

```ts
  <div
    data-layout={{
      name: 'block1',
      location: { left: '50%', top: '10%', width: '140u', height: '24u' },
    }}
  >
    <span>block 1</span>
  </div>
```

Note that the width and height of each block is unmanaged which causes RLG to fit the bounds
of the block to its contents.

And the lines are described by a Connect component:

```ts
  <Connect
    blockA={'block1'}
    blockB={'block2'}
    g={this._g}
  />
```

Note that as with Drag and Drop the implementation of the Connect render method is at the application level and built on top of React.

```ts
  render() {
    ...
    const containersize = this.props.g.containersize()

    const pA = this.state.connectPointA;
    const pB = this.state.connectPointB;

    const style = {
      pointerEvents: 'none' as 'none',
      position: 'absolute' as 'absolute'
    }

    return (
      <svg 
        style={style}
        width={containersize.width}
        height={containersize.height}
      >
        <path d={`M ${pA.x} ${pA.y} L ${pB.x} ${pB.y}`} stroke="black" strokeWidth="1" fill="none"/>
      </svg>
    )
  }
```

The onChangeEvent is responsible for computing the two connection points. It's implementation is:

```ts
  onChangeEvent = () => {

    if (this._blockA && this._blockB) {
      // Get the bounds of the two blocks
      const rA = this._blockA.rect
      const rB = this._blockB.rect

      let originA = this.props.originA
      if (!originA) {
        originA = {x: .5, y: .5}
      }

      let originB = this.props.originB
      if (!originB) {
        originB = {x: .5, y: .5}
      }

      // Get the center points of the two blocks
      const pA = connectPoint(rA, originA)
      const pB = connectPoint(rB, originB)

      // Get the points outside of the block to connect to.
      // lineRectIntersection computes the intersection of a line going
      // from the center of each block with the bounds of each block
      const connectPointA = lineRectIntersection({start: pA, end: pB}, rA)
      const connectPointB = lineRectIntersection({start: pA, end: pB}, rB)

      // Update state
      if (connectPointA && connectPointB) {
        this.setState({
          connectPointA,
          connectPointB
        })
      }
    }
  }
  ```