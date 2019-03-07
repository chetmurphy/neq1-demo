import * as React from 'react';
import styled from 'styled-components';

import {
  Block,
  Blocks, 
  Generator,
  ICreate, 
  IDataLayout,
  IGenerator,
  IGenericProps,
  IMetaDataArgs,
  ISize,
  Layout,
  Panel, 
  Params,
  PositionRef,
  updateParamLocation,
} from 'react-layout-generator'

import cssColor from '../assets/colors';

// tslint:disable-next-line:variable-name
const Title = styled.span`
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
  color: ${cssColor.light};
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
`

interface ITableProps extends React.HTMLProps<HTMLDivElement> {
  name: string;
  title: string;
  containersize: ISize;
  rowData: string[][];
}

export default class Table extends React.Component<ITableProps> {
  private g: IGenerator;
  private params: Params;

  constructor(props: ITableProps) {
    super(props);

    this.params = new Params({
      // tslint:disable-next-line:object-literal-sort-keys
      name: 'props.name', initialValues: [
        ['containersize', { width: 0, height: 0 }],
        ['titleHeight', 36],
        ['rowHeight', 24]
      ]
    });
    this.g = new Generator('chart', this.init, this.params, this.create);
  }

  public render() {

    return (
      <Layout
        name={this.props.name}
        g={this.g}
        containersize={this.props.containersize}
      >
        <Panel data-layout={{ name: 'title' }} style={{ backgroundColor: 'black' }} >
          {(args: IMetaDataArgs) => (
              <>
                <Title>{this.props.name}</Title>
                {this.createRows()}
              </>
         )}
        </Panel>
      </Layout>
    );
  }

  private createRows = () => {
    return null;
  }

  private init = (g: IGenerator): Blocks => {

    const containersize = this.params.get('containersize') as ISize;
    const titleHeight = this.params.get('titleHeight') as number;
    const rowHeight = this.params.get('rowHeight') as number;
    // const footerHeight = this.params.get('footerHeight') as number;

    const blocks = g.blocks();

    if (this.params.changed()) {
      // update Layout for each update
      blocks.map.forEach((block) => {
        block.touch();
      });
    }

    if (containersize) {

      const title: IDataLayout = {
        location: { left: 0, top: 0, width: containersize.width, height: titleHeight },
        // tslint:disable-next-line:object-literal-sort-keys
        editor: {
          edits: [
            { ref: PositionRef.position, variable: 'titleHeight', updateParam: updateParamLocation }
          ]
        }
      }
      // console.log('cardSize', cardSize);

      blocks.set('title', title, g);

      const row: IDataLayout = {
        location: { left: 0, top: titleHeight, width: containersize.width, height: rowHeight },
        // tslint:disable-next-line:object-literal-sort-keys
        positionChildren: this.positionRowChildren
      }

      blocks.set('row', row, g);

    }
    return blocks;
  }

  private positionRowChildren = (block: Block, g: IGenerator, index: number, props: IGenericProps) => {
    // Return a Layout relative to block starting at position at (0, 0)

    const rowHeight = this.params.get('rowHeight') as number;
    const containersize = this.params.get('containersize') as ISize;
    const titleHeight = this.params.get('titleHeight') as number;

    // These children get placed vertically based on index
    const child: IDataLayout = {
      location: { left: 0, top: titleHeight + index * rowHeight, width: containersize.width, height: rowHeight }
    };

    // This block is temp and will not be stored in blocks
    return new Block('temp', child, g);
  }

  private create(args: ICreate): Block {

    if (!args.dataLayout) {
      // tslint:disable-next-line:no-console
      console.error(`TODO default position ${args.name}`);
    }

    const block = args.g.blocks().set(args.name, args.dataLayout, args.g);

    return block;
  }
}