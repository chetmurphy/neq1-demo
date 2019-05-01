import * as React from 'react';
import styled from 'styled-components';

import {
  EditHelper,
  IDataLayout,
  IEditTool,
  IGenerator,
  ISize,
  Params,
  Status
} from '@neq1/core'

import {Layout} from '@neq1/layout'
import {rowsGenerator} from '@neq1/rows-generator'

import cssColor from '../assets/colors';

// tslint:disable-next-line:variable-name
export const Button = styled.button`
  font-size: 24;
  padding: 0;
  background: transparent;
  border: none;
  color: ${cssColor.lightMiddle};
`

// tslint:disable-next-line:variable-name
export const SelectedButton = styled.button`
  font-size: 24;
  background: 'white';
  border: none;
  color: ${cssColor.middle};
`
interface IButton {
  component: (props: any) => JSX.Element;
  name: string;
}

interface IButtonRef extends IButton {
  handler: (event: React.MouseEvent) => void;
}

interface IToolBarProps {
  commands: IButton[];
  editHelper: EditHelper;
}

interface IToolBarState {
  update: number;
}

export default class ToolBar extends React.Component<IToolBarProps, IToolBarState> implements IEditTool {
  private n: IGenerator;
  private params: Params;

  constructor(props: IToolBarProps) {
    super(props);

    this.n = rowsGenerator({name: 'example.toolBar', editHelper: props.editHelper});

    this.params = this.n.params();
    this.params.set('itemSize', {width: 30, height: 24});
    this.state = { update: 0 };

    this.props.editHelper.register(this);
  }

  public componentWillReceiveProps(props: IToolBarProps) {
    this.props.editHelper.register(this);
  }

  public updateTool = () => {
    this.setState({ update: this.state.update + 1 });
  }

  public render() {
    this.n.reset();

    return (
      <Layout
        name='ToolBar'
        g={this.n}
      >
        {this.createElements()}
      </Layout>
    );
  }

  private onClick = (name: string) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      this.props.editHelper.do(name);
      this.setState({ update: this.state.update + 1 });
    }
  }

  private createElements = () => {

    const r = this.props.commands.map((e: IButtonRef, i) => {
      // const width = this.size.get(e.name)

   
      let v: any = null;
      const fontSize = (this.params.get('itemSize') as ISize).height;
      if (e.name !== '') {
        const status = this.props.editHelper.status(e.name);
        if (status !== undefined) {
          
          const color = (status === 0) ? cssColor.middle : ((status === Status.down) ? cssColor.light : cssColor.darkMiddle);
          const background = status === Status.up ? cssColor.light : 'transparent';
          const props = { color, fontSize, style: {background }}
         
          v = (
            <Button key={e.name} data-layout={{ name: e.name }} onClick={this.onClick(e.name)} style={{background}}>
              {e.component(props)}
            </Button>
          );
        }
      } else {
        const name1 = `separator${i}`;
        const p: IDataLayout = {
          location: { left: 0, top: 0, width: fontSize, height: fontSize / 2 }
        }
        v = e.component({ key: name1, 'data-layout': { name: name1, ...p }, color: cssColor.lightMiddle, fontSize })
      }
      return v;
    });
    return r;
  }
}