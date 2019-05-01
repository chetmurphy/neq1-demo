import * as React from 'react';

import styled from 'styled-components';

import {
  Block,
  IGenerator,
  IPoint,
  IRect
} from '@neq1/core'


// tslint:disable-next-line:variable-name
const Container = styled.div`
  position: absolute;
  color: #000;
  background: #fffb02;
  border-radius: 5px;
  background: linear-gradient(top, #f9d835, #f3961c);
  cursor: move;
`
interface INoteProps {
  container?: IRect;
  block?: Block;
  edit?: boolean;
  g?: IGenerator;
  context?: Map<string, any>;
  update?: () => void;
}

interface INoteState {
  update: number;
}

export default class Note extends React.Component<INoteProps, INoteState> {
  private startOrigin: IPoint;
  private startLocation: IPoint;

  constructor(props: INoteProps) {
    super(props);
    this.state = {
      update: 0
    }
  }

  public render() {
    return (
      <Container {...this.props} onMouseDown={this.onMouseDown}>
        {this.props.children}
      </Container>
    )
  }

  private moveUpdate(x: number, y: number) {
    // compute the relative distance
    const deltaX = x - this.startOrigin.x;
    const deltaY = y - this.startOrigin.y;


    const r = this.props.block!.rect
    // update
    this.props.block!.rect = {
      x: this.startLocation.x + deltaX,
      y: this.startLocation.y + deltaY,
      width: r.width,
      height: r.height
    }

    // this.setState({update: this.state.update + 1});
    if (this.props.update) { this.props.update(); }
  }

  private onMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();

    // capture mouse
    this.addEventListeners();

    // initialize 
    this.startOrigin = { x: event.pageX, y: event.pageY }
    const r = this.props.block!.rect;
    this.startLocation = { x: r.x, y: r.y };
  }

  private onHtmlMouseMove = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      this.moveUpdate(event.pageX, event.pageY);
    }
  }

  private onHtmlMouseUp = (event: MouseEvent) => {
    if (event) {
      event.preventDefault();
      this.removeEventListeners()
    }
  }

  private addEventListeners = () => {
    document.addEventListener('mouseup', this.onHtmlMouseUp);
    document.addEventListener('mousemove', this.onHtmlMouseMove);
  }

  private removeEventListeners = () => {
    document.removeEventListener('mouseup', this.onHtmlMouseUp);
    document.removeEventListener('mousemove', this.onHtmlMouseMove);
  }
}
