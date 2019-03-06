### Home Implementation

This page is an example of a path animation. In this implementation there are one to four vertical line segments depending upon the available space. A path animation works by moving each block along the path. At the end of the path the blocks can be discarded or as in this example put back at the beginning.

A path animation is implemented as a hook that can be used with any generator. 

```ts
  <Layout
    name={'Layout.intro.example'}
    service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
    debug={DebugOptions.none}
    animate={{ active: true }}
    g={this._g}
    overflowX={OverflowOptions.hidden}
    overflowY={OverflowOptions.hidden}
  >
    {this.content()}
  </Layout>
```

Where the contents is a list of div's containing the features:

```ts
  <div
    key={name}
    data-layout={{
      name,
      origin: { x: 0.5, y: 0.5 },
      location: { left: 0, top: 0, width: 250, height: '100u' },
      layer: 1
    }}
  >
    <Description>{feature}</Description>
  </div>
```

And the pathHook is defined as:

```ts
  pathHook({
    prefix: 'Paths #A',
    points: [
      {
        min: 0, max: 480, points: [
          {x: '50%', y: 0}, {x: '50%',y: '100%'},
        ],
      },
      {
        min: 480, max: 720, points: [
          {x: '30%', y: 0}, {x: '30%',y: '100%'},
          {x: '60%', y: 0}, {x: '60%',y: '100%'},
        ],
      },
      {
        min: 720, max: 1024, points: [
          {x: '25%', y: 0}, {x: '25%',y: '100%'},
          {x: '50%', y: 0}, {x: '50%',y: '100%'},
          {x: '75%', y: 0}, {x: '75%',y: '100%'},
        ],
      },
      {
        min: 1024, max: 2560, points: [
          {x: '20%', y: 0}, {x: '20%',y: '100%'},
          {x: '40%', y: 0}, {x: '40%',y: '100%'},
          {x: '60%', y: 0}, {x: '60%',y: '100%'},
          {x: '80%', y: 0}, {x: '80%',y: '100%'},
        ],
      },

    ],
    input: () => blocks.layers(1),
    update: this._flow,
    output: this._flow,
    velocity: .05,
    spacing: 200,
    fill: true,
    g: this._g
  })
```