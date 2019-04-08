### Dashboard Implementation

This page shows a dashboard layout using default settings. If you turn on edit (the top most icon in the toolbar) you can change the size of the panels and close the side panels.

The layout is:

```ts
  <Layout
    name={"Layout.dashboard.example"}
    service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
    g={this.g}
    style={styleLayout}
  >
```

Each panel is of the form:

```ts
  <Panel data-layout={{ name: "topLeft", layer: 1 }} style={style}>
    {(args: IMetaDataArgs) => (
      <div>
        topLeft
        ...
      </div>
    )}
  </Panel>
```

Note that the layout has the style:

```ts
  const styleLayout = {
    borderStyle: "solid",
    borderWidth: "5px",
    borderColor: "gainsboro"
  }
```

And the panels have the style:

```ts
  const style = {
    padding: "5px",
    borderStyle: "solid",
    borderWidth: "5px",
    borderColor: "gainsboro"
  };
```

The chart in the center is a simple D3 chart in React that returns svg in JSX. It is based off the work of [Swizec](https://swizec.com/blog/declarative-d3-charts-react-16-3/swizec/8353).

```tsx
  <svg
    width={args.container.width - 20}
    height={args.container.height - 20}
    viewBox={"0 0 500 200"}
    preserveAspectRatio = "none"
  >
    <BarChart
      x={0}
      y={0}
      width={300}
      height={200}
      data={[1,2,3,4,3,2,1,3,4,5,6,7,1]}
    />
  </svg>
```