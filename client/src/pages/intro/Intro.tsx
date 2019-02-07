import * as React from "react";
import styled from "styled-components";

import {
  DebugOptions,
  IEditHelperProps,
  OverflowOptions,
  // ParamValue,
  RLGLayout,
  rollGenerator,
  ServiceOptions,
  Status,
  Unit
} from "react-layout-generator";

// tslint:disable-next-line:variable-name
const Description = styled.div`
  word-break: normal;
  white-space: normal;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.25rem;
`;

interface IIntroState {
  update: number;
}

export default class Intro extends React.Component<
  IEditHelperProps,
  IIntroState
> {
  private g = rollGenerator("rlg.intro");
  private edit: boolean = false;

  constructor(props: IEditHelperProps) {
    super(props);

    this.state = { update: 0 };
  }

  public componentDidMount() {
    // console.log('EditHelpers load Intro');
    this.props
      .editHelper()
      .load([
        {
          name: "edit",
          command: this.setEdit,
          status: this.edit ? Status.up : Status.down
        }
      ]);
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up;
      this.edit = true;
    } else {
      status = Status.down;
      this.edit = false;
    }

    // this.grid(this._gridUnit)
    // this._g.clear();
    this.setState({ update: this.state.update + 1 });

    return status;
  };

  public render() {
    return (
      <RLGLayout
        name={"RLGLayout.intro.example"}
        service={this.edit ? ServiceOptions.edit : ServiceOptions.none}
        debug={DebugOptions.none}
        params={[
          ["containersize", { width: 1434, height: 714 }],
          ["animationStart", 0],
          ["animationTime", 0],
          ["animationLast", 0],
          ["velocity", 0.1],
          ["update", 0],
          ["frameHeight", 3917.1],
          ["deltaTime", 16.73699999999735],
          ["animate", 1],
          ["velocity", {x: 0, y: 0.05}]
        ]}
        animate={{ active: true }}
        g={this.g}
        overflowX={OverflowOptions.hidden}
        overflowY={OverflowOptions.hidden}
      >
        {this.content()}
      </RLGLayout>
    );
  }

  public content = () => {
    let index = 1000;
    const features: any[] = [
      <div key={`${++index}`}>Template Support.</div>,
      <div key={`${++index}`}>Dashboard</div>,
      <div key={`${++index}`}>Examples built with RLG</div>,
      <div key={`${++index}`}>Animation Support</div>,
      <div key={`${++index}`}>Typescript</div>,
      <div key={`${++index}`}>Core Editor Support</div>,
      <div key={`${++index}`}>Design and Runtime</div>,
      <div key={`${++index}`}>Serialization Support</div>,
      <div key={`${++index}`}>Animation Roll Generator</div>,
      <div key={`${++index}`}>Responsive Desktop Generator</div>,
      <div key={`${++index}`}>HTML and SVG</div>,
      <div key={`${++index}`}>Games</div>,
      <div key={`${++index}`}>Sample Solitaire Game</div>,
      <div key={`${++index}`}>Text Editing</div>,
      <div key={`${++index}`}>Ideal for SVG</div>,
      <div key={`${++index}`}>Games</div>,
      <div key={`${++index}`}>Columns Generator</div>,
      <div key={`${++index}`}>Position and Size Editing</div>,
      <div key={`${++index}`}>Layout in React</div>,
      <div key={`${++index}`}>Diagrams</div>,
      <div key={`${++index}`}>Fine Grain Responsive</div>,
      <div key={`${++index}`}>Fit Text to Container</div>,
      <div key={`${++index}`}>Animation: You're looking at one now</div>,
      <div key={`${++index}`}>Rows Generator</div>,
      <div key={`${++index}`}>Sample Editor</div>,
      <div key={`${++index}`}>Dynamic Generator</div>,
      <div key={`${++index}`}>Layer Support with Editing</div>,
      <div key={`${++index}`}>Bring Forward, Send to Back, ...</div>,
      <div key={`${++index}`}>Context Menu</div>,
      <div key={`${++index}`}>ToolBar in Editor</div>,
      <div key={`${++index}`}>Align Left, Top, Center, ... </div>,
      <div key={`${++index}`}>Linked Elements</div>,
      <div key={`${++index}`}>Persistance Options</div>,
      <div key={`${++index}`}>Custom Animation Behavior</div>,
      <div key={`${++index}`}>Physics Engine Capable</div>,
      <div key={`${++index}`}>Debug Options</div>,
      <div key={`${++index}`}>Overlay Support</div>
    ];
    const jsx = [];
    let i = 0;
    let j = 0;
    while (i < features.length) {
      const name = `${i++}`;
      let col = 25;
      if (j === 1) {
        col = 75;
      }
      if (j === 2) {
        col = 50;
      }
      jsx.push(
        <div
          key={name}
          data-layout={{
            name,
            position: {
              origin: { x: 50, y: 50 },
              location: { x: col, y: i * 15, unit: Unit.percent },
              size: { width: 250, height: 100, unit: Unit.unmanagedHeight }
            }
          }}
        >
          <Description>{features[i]}</Description>
        </div>
      );

      // Distribute horizontally
      j += 1;
      if (j > 2) {
        j = 0;
      }
    }

    return jsx;
  };
}

export const introJSX = (props: IEditHelperProps): JSX.Element => {
  return (
    <Intro {...props} />
  );
};
