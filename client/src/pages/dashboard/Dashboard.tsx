import * as React from "react";

// import Chart from "react-apexcharts";
import styled from "styled-components";

import {
  IEditHelperProps,
  ISize,
  Params,
  ParamValue,
  rectSize,
  ServiceOptions,
  Status
} from "@neq1/core";

import {dashboardGenerator} from "@neq1/dashboard-generator";

import {IMetaDataArgs, Panel} from "@neq1/panel";

import {Layout} from "@neq1/layout";


import { BarChart } from './d3/Bar';

interface IProps {
  containersize: ISize;
  variable?: string;
  left?: number | string;
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  bold?: boolean;
}

// tslint:disable-next-line:variable-name
export const Instruction = styled.p<IProps>`
  word-break: break-all;
  max-width: ${p => p.containersize.width};
  overflow-wrap: break-word;
`;

// tslint:disable-next-line:variable-name
export const List = styled.ul<IProps>`
  max-width: ${p => p.containersize.width};
  list-style: none;
`;
// tslint:disable-next-line:variable-name
export const Item = styled.li<IProps>`
  max-width: ${p => p.containersize.width};
  white-space: wrap;

  ${({ bold }) => bold && `font-weight: bold;`}
`;

// tslint:disable-next-line:variable-name
export const Close = styled.button<IProps>`
  position: absolute;
  background: transparent;
  border: none;
  right: ${p => p.right};
  top: ${p => p.top};
`;

interface IDashboardProps extends IEditHelperProps {
  onUpdate?: () => void;
}

interface IDashboardState {
  update: number;
  containersize: ISize;
}

const values: Array<[string, ParamValue]> = [];

// tslint:disable-next-line:no-var-requires
const dashboardMarkdownFile = require("./description.md");
let gDashboardMarkdown: string = "";
export function dashboardMarkdown() {
  return gDashboardMarkdown;
}

const gDashboardParams = new Params({
  name: "dashboard",
  initialValues: values
});

export default class Dashboard extends React.Component<
  IDashboardProps,
  IDashboardState
> {
  private g = dashboardGenerator("rlg.dashboard.example", gDashboardParams);
  private _edit: boolean = false;

  constructor(props: IEditHelperProps) {
    super(props);

    this.state = { update: 0, containersize: { width: 0, height: 0 } };
  }

  public componentDidMount() {
    fetch(dashboardMarkdownFile)
      .then(response => response.text())
      .then(text => {
        // Logs a string of Markdown content.
        // Now you could use e.g. <rexxars/react-markdown> to render it.
        gDashboardMarkdown = text;
        if (this.props.onUpdate) {
          this.props.onUpdate();
        }
      });

    this.props
      .editHelper()
      .load([{ name: "edit", command: this.setEdit, status: this.editState }]);
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

  public editState = () => {
    return this._edit ? Status.up : Status.down;
  };

  public render() {
    // const contentcontainersize = this.g.containersize('content');

    const styleLayout = {
      borderStyle: "solid",
      borderWidth: "5px",
      borderColor: "gainsboro"
    };
    const style = {
      padding: "5px",
      borderStyle: "solid",
      borderWidth: "5px",
      borderColor: "gainsboro"
    };
    return (
      <Layout
        name={"Layout.dashboard.example"}
        service={this._edit ? ServiceOptions.edit : ServiceOptions.none}
        g={this.g}
        style={styleLayout}
      >
        <Panel data-layout={{ name: "topLeft", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <div>
              topLeft
              {args.service === ServiceOptions.edit
                ? this.closeButton(rectSize(args.container), "topLeftWidth")
                : null}
            </div>
          )}
        </Panel>

        <Panel data-layout={{ name: "topCenter", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <>
              <span>topCenter</span>
            </>
          )}
        </Panel>

        <Panel data-layout={{ name: "topRight", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <>
              <span>topRight</span>
              {args.service === ServiceOptions.edit
                ? this.closeButton(rectSize(args.container), "topRightWidth")
                : null}
            </>
          )}
        </Panel>

        <Panel data-layout={{ name: "middleLeft", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <>
              <span>middleLeft</span>
              {args.service === ServiceOptions.edit
                ? this.closeButton(rectSize(args.container), "middleLeftWidth")
                : null}
            </>
          )}
        </Panel>

        <Panel data-layout={{ name: "middleCenter", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <>
              
              <svg 
                width={args.container.width - 20} 
                height={args.container.height - 20} 
                viewBox={`${0} ${0} ${500} ${200}`}
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
            </>
          )}
        </Panel>

        <Panel data-layout={{ name: "middleRight", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <>
              <span>middleRight</span>
              {args.service === ServiceOptions.edit
                ? this.closeButton(rectSize(args.container), "middleRightWidth")
                : null}
            </>
          )}
        </Panel>

        <Panel data-layout={{ name: "bottomLeft", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <>
              <span>bottomLeft</span>
              {args.service === ServiceOptions.edit
                ? this.closeButton(rectSize(args.container), "bottomLeftWidth")
                : null}
            </>
          )}
        </Panel>

        <Panel data-layout={{ name: "bottomCenter", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <>
              <span>bottomCenter</span>
              
            </>
          )}
        </Panel>

        <Panel data-layout={{ name: "bottomRight", layer: 1 }} style={style}>
          {(args: IMetaDataArgs) => (
            <>
              <span>bottomRight</span>
              {/* <Bar container={args.container}/> */}
              {args.service === ServiceOptions.edit
                ? this.closeButton(rectSize(args.container), "bottomRightWidth")
                : null}
            </>
          )}
        </Panel>
      </Layout>
    );
  }

  public closePanel = (e: React.MouseEvent<HTMLButtonElement>) => {
    // tslint:disable-next-line:no-string-literal
    const value = e.target["value"];
    this.g.params().set(value, 0);
    this.setState({ update: this.state.update + 1 });
  };

  private closeButton = (containersize: ISize, variable: string) => {
    return (
      <Close
        containersize={containersize}
        right={0}
        top={0}
        // tslint:disable-next-line:jsx-no-lambda
        onClick={this.closePanel}
        value={variable}
      >
        X
      </Close>
    );
  };
}

// interface IBarProps {
//   container: IRect
// }
// // tslint:disable-next-line:max-classes-per-file
// class Bar extends React.Component<IBarProps> {

//   public render() {

//     const data = {
//       labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
//       series: [
//         [1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
//       ]
//     };

//     const options = {
//       high: 10,
//       low: -10,
//       axisX: {
//         labelInterpolationFnc: (value: number, index: number) => {
//           return index % 2 === 0 ? value : null;
//         }
//       },

//       width: this.props.container.width,
//       height: this.props.container.height
//     };

//     const type = 'bar'

//     return (
//       <div>
//         <Chart data={data} options={options} type={type} />
//       </div>
//     )
//   }
// }
