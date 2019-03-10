import * as React from "react";

import {

  Block,
  Blocks,
  Generator,
  ICreate,
  IEditHelperProps,
  IGenerator,
  Layout,
  OverflowOptions,
  Params,
  ServiceOptions,
  Status
} from "react-layout-generator";
import { Connect } from 'src/components/Connect';

// tslint:disable-next-line:no-var-requires
const diagramMarkdownFile = require("./description.md");
let gDiagramMarkdown: string = ''
export function diagramMarkdown() {
  return gDiagramMarkdown
}

interface IDiagramProps extends IEditHelperProps {
  onUpdate?: () => void
}

interface IDiagramState {
  update: number;
}

export default class Diagram extends React.Component<IDiagramProps, IDiagramState> {
  private _g: IGenerator
  private _params: Params = new Params({ name: 'Diagram' })
  private _edit: boolean = false;

  constructor(props: IEditHelperProps) {
    super(props);

    this._g = new Generator('Diagram', this.init.bind(this), this._params, this.create.bind(this))

    this.state = { update: 0 };
  }

  public componentDidMount() {

    fetch(diagramMarkdownFile)
      .then(response => response.text())
      .then(text => {
        gDiagramMarkdown = text;
        if (this.props.onUpdate) {
          this.props.onUpdate()
        }
      });

    this.props.editHelper().load([
      {
        name: "edit",
        command: this.setEdit,
        status: this._edit ? Status.up : Status.down
      }
    ]);
  }

  public setEdit = (status: Status) => {
    if (status === Status.down) {
      status = Status.up;
      this._edit = true;
    } else {
      status = Status.down;
      this._edit = false;
    }

    // this.grid(this._gridUnit)
    // this._g.clear();
    this.setState({ update: this.state.update + 1 });

    return status;
  };

  public render() {

    return (
      <Layout
        name={"Layout.diagram.example"}
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        animate={{ active: false }}
        g={this._g}
        overflowX={OverflowOptions.hidden}
        overflowY={OverflowOptions.hidden}
      >

        <div
          data-layout={{
            name: 'block1',
            location: { left: '50%', top: '10%', width: '140u', height: '24u' }, 
          }}
        >
          <span>block 1</span>
        </div>

        <div
          data-layout={{
            name: 'block2',
            location: { left: '40%', top: '25%', width: '140u', height: '24u' },
          }}
        >
          <span>block 2</span>
        </div>

        <div
          data-layout={{
            name: 'block3',
            location: { left: '60%', top: '40%', width: '140u', height: '24u' },
          }}
        >
          <span>block 3 - Click the info circle.</span>
        </div>

        <div
          data-layout={{
            name: 'block4',
            origin: {x: .5, y: .5},
            location: { left: '30%', top: '60%', width: '140u', height: '24u' },
          }}
        >
          <span>block 4 - Turn on edit and drag me.</span>

        </div>

        <Connect 
          blockA={'block1'}
          blockB={'block2'}
          g={this._g}
        />

        <Connect 
          blockA={'block2'}
          blockB={'block3'}
          g={this._g}
        />

        <Connect 
          blockA={'block3'}
          blockB={'block4'}
          g={this._g}
        />

        <Connect 
          blockA={'block2'}
          blockB={'block4'}
          g={this._g}
        />
      </Layout>
    );
  }

  public init(g: IGenerator): Blocks {
    const blocks = g.blocks()

    if (this._params.changed() || g.containerChanged()) {
      // update Layout for each update
      blocks.map.forEach(block => {
        block.touch()
      })
    }

    return blocks
  }

  protected create(args: ICreate): Block {
    const block = args.g.blocks().set(args.name, args.dataLayout, args.g);
    return block;
  }
}

export const diagramJSX = (props: IEditHelperProps): JSX.Element => {
  return <Diagram {...props} />;
};
