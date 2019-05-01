import * as React from 'react';
import styled from 'styled-components';

import cssColor from '../assets/colors';

import { columnsGenerator } from '@neq1/columns-generator';
import { Layout } from'@neq1/layout';

// tslint:disable-next-line:variable-name
export const Button = styled.button`
  font-size: 1rem;
  background: transparent;
  border: none;
  color: ${cssColor.light};
`;

// tslint:disable-next-line:variable-name
export const SelectedButton = styled.button`
  font-size: 1rem;
  background: ${cssColor.light};
  border: none;
  color: ${cssColor.dark};
`;
interface IElement {
  component: any
  markdown: () => string
  name: string
}

interface IElementRef extends IElement {
  handler: (event: React.MouseEvent) => void;
}

interface INavBarProps {
  elements: IElement[];
  callback: (component: any, markdown:  () => string) => void;
}

interface INavBarState {
  selected: string | undefined;
  update: number;
}

export default class NavBar extends React.Component<
  INavBarProps,
  INavBarState
> {
  private n = columnsGenerator('navbar');
  private elementRefs: IElementRef[] = [];
  private size: Map<string, number> = new Map();
  private changed: number = 0;

  constructor(props: INavBarProps) {
    super(props);

    this.props.elements.forEach((e: IElement) => {
      this.elementRefs.push({
        component: e.component,
        markdown: e.markdown,
        name: e.name,
        handler: (event: React.MouseEvent<HTMLButtonElement>) => {
          if (this.state.selected !== e.name) {
            this.setState({ selected: e.name });
            this.props.callback(e.component, e.markdown);
          }
        }
      });
    });

    this.state = {
      selected: undefined,
      update: 0
    };

    // const item = this.elementRefs.length ? this.elementRefs[0].name : undefined;
    // const markdown = this.elementRefs.length ? this.elementRefs[0].markdown : '';
    // setTimeout(() => {
    //   this.setState({ selected: item });
    //   this.props.callback(item, markdown);
    // }, 400);
  }

  public render() {
    this.changed = 0;
    this.n.reset();

    return (
      <Layout name='navbar' g={this.n}>
        {this.createElements()}
      </Layout>
    );
  }

  protected setSize = (name: string, v: number) => {
    const n = this.size.get(name);
    if (n === undefined || v !== n) {
      this.size.set(name, v);
      if (!this.changed) {
        this.changed = 1;
        setTimeout(() => {
          this.setState({ update: this.state.update + 1 });
        }, 3);
      }
    }
  };

  private createElements = () => {
    return this.elementRefs.map((e: IElementRef) => {
      const width = this.size.get(e.name);
      if (e.name === this.state.selected) {
        return (
          <div
            key={e.name}
            data-layout={{
              name: e.name,
              location: {
                left: 0,
                top: 0,
                width: width ? width : 100,
                height: 20
              }
            }}
          >
            <SelectedButton
              key={e.name}
              data-layout={{ name: e.name }}
              onClick={e.handler}
            >
              {e.name}
            </SelectedButton>
          </div>
        );
      } else {
        return (
          <div
            key={e.name}
            data-layout={{
              name: e.name,
              location: {
                left: 0,
                top: 0,
                width: width ? width : 100,
                height: 20
              }
            }}
          >
            <Button
              key={e.name}
              ref={c => {
                if (c) {
                  this.setSize(e.name, c.offsetWidth);
                }
              }}
              onClick={e.handler}
            >
              {e.name}
            </Button>
          </div>
        );
      }
    });
  };
}
