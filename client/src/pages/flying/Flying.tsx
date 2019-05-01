import * as React from "react";

import {
  Block,
  IEditHelperProps,
  OverflowOptions,
  Queue,
  ServiceOptions,
  Status
} from "@neq1/core";

import {
  Layout,
} from '@neq1/layout'

import {
  IMetaDataArgs,
  Panel,
} from '@neq1/panel'

import {
  pathHook
} from '@neq1/path-hook'

import {
  dynamicGenerator,
} from '@neq1/dynamic-generator'
 
import { useFatBird } from './fatBird';

// tslint:disable-next-line:no-var-requires
const flyingMarkdownFile = require("./description.md");
let gFlyingMarkdown: string = "";
export function flyingMarkdown() {
  return gFlyingMarkdown;
}

interface IFlyingProps extends IEditHelperProps {
  onUpdate?: () => void;
}

interface IFlyingState {
  update: number;
}

export default class Flying extends React.Component<IFlyingProps, IFlyingState> {
  private _g = dynamicGenerator("rlg.flying");
  private _edit: boolean = false;
  private _flowFlightTop: Queue<Block> = new Queue<Block>("flowFlightTop");
  private _flowFlightBottom: Queue<Block> = new Queue<Block>(
    "flowFlightBottom"
  );

  constructor(props: IFlyingProps) {
    super(props);

    this.state = { update: 0 };
  }

  public componentDidMount() {
    fetch(flyingMarkdownFile)
      .then(response => response.text())
      .then(text => {
        // Logs a string of Markdown content.
        // Now you could use e.g. <rexxars/react-markdown> to render it.
        gFlyingMarkdown = text;
        if (this.props.onUpdate) {
          this.props.onUpdate();
        }
      });

    this.props.editHelper().load([
      {
        name: "edit",
        command: this.setEdit,
        status: this._edit ? Status.up : Status.down
      }
    ]);

    const hooks = this._g.hooks();
    const blocks = this._g.blocks();

    function fatBirdCollide(block: Block) {
      block.hidden = true
    }
    

    hooks.set(
      "flightTop",
      pathHook({
        prefix: "flightTop",
        points: [
          {
            min: 0,
            max: 2500,
            points: [{ x: '110%', y: 0 }, { x: "-10%", y: 0 }]
          }
        ],
        input: () => blocks.layers(1),
        update: this._flowFlightTop,
        output: this._flowFlightTop,
        velocity: 0.20,
        spacing: 200,
        fill: true,
        sprite: () => this._g.lookup('FatBird'),
        onSpriteCollide: fatBirdCollide,
        g: this._g
      })
    );

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
        sprite: () => this._g.lookup('FatBird'),
        onSpriteCollide: fatBirdCollide,
        velocity: 0.20,
        spacing: 200,
        fill: true,
        g: this._g
      })
    );
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up;
      this._edit = true;
    } else {
      status = Status.down;
      this._edit = false;
    }

    this.setState({ update: this.state.update + 1 });

    return status;
  };

  public render() {
    
    return (
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
    );
  }

  public content = () => {
    const jsx: JSX.Element[] = [];

    const icicle: string[] = [
      "30%",
      "40%",
      "35%",
      "25%",
      "20%",
      "25%",
      "20%",
      "25%",
      "20%",
      "30%"
    ];

    let i = 0
    icicle.forEach(v => {
      const name = `icicle${i++}`
      jsx.push(
        <div
          key={name}
          data-layout={{
            name,
            origin: { x: 0, y: 0 },
            location: { left: i*10, top: 0, width: 50, height: v },
            layer: 1
          }}
          style={{backgroundColor: 'saddlebrown', borderStyle: 'solid', borderColor: 'black', borderWidth: 1}}
        />
      );
    });

    const spike: string[] = [
      "45%",
      "35%",
      "40%",
      "55%",
      "55%",
      "55%",
      "60%",
      "55%",
      "60%",
      "55%"
    ];

    let j = 0;
    spike.forEach(v => {
      const name = `spike${j++}`
      jsx.push(
        <div
          key={name}
          data-layout={{
            name,
            origin: { x: 0, y: 0 },
            location: { left: j*10, bottom: 0, width: 50, height: v },
            layer: 2
          }}
          style={{backgroundColor: 'saddlebrown', borderStyle: 'solid', borderColor: 'black', borderWidth: 1}}
        />
      );
    });

    jsx.push(
      <Panel
      key={'FatBird'}
      data-layout={{
        name: 'FatBird',
        origin: { x: .50, y: 0 }, 
        location:  { left: '10%', top: '50%', width: 70, height: 60 },
      }}
    >
      {(args: IMetaDataArgs) => (
        <RenderFatBird block={args.block}/>
      )}
      </Panel>
    )

    return jsx;
  };
}

// tslint:disable-next-line:variable-name
// const RenderFatBird = () => {
//   const child = useFatBird()
//   return ({child})
// };

// tslint:disable-next-line:no-empty-interface
interface IProps {
  block: Block
}

// tslint:disable-next-line:variable-name
export const RenderFatBird: React.FunctionComponent<IProps> = ({ block }: IProps): JSX.Element =>
{
  const child = useFatBird(block)
  return <div>{child}</div>
}

export const introJSX = (props: IEditHelperProps): JSX.Element => {
  return <Flying {...props} />;
};
