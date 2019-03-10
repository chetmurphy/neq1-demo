import * as React from 'react';

import styled from 'styled-components';

import {
  IEditableTextData,
  IOrigin,
  ISize,
  Params
} from 'react-layout-generator'

interface IProps {
  containersize: ISize;
  origin: IOrigin;
  fontSize: number;
}

// tslint:disable-next-line:variable-name
export const Editable = styled.div<IProps>`
  font-family: Arial, Helvetica, sans-serif;
  font-size: ${(p) => p.fontSize.toString()};
  position: absolute;
  white-space: nowrap;
  overflow: 'hidden';
  word-break: keep-all;
`

// tslint:disable-next-line:variable-name
export const NotEditable = styled.div<IProps>`
  display: inline-block;
  font-family: Arial, Helvetica, sans-serif;
  font-size: ${(p) => p.fontSize.toString()};
  position: absolute;
  user-select: none;
`

interface IEditableTextProps extends React.Props<HTMLDivElement> {
  params: Params;
  edit: boolean;
  variable: string;
  containersize: ISize;
}

interface IEditableTextState {
  update: number;
}

// The follow implementation is based on
// https://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable#answer-27255103
// tslint:disable-next-line:max-classes-per-file
export default class EditableText extends React.Component<IEditableTextProps, IEditableTextState> {
  private root: HTMLDivElement; // Ref to the editable div
  private mutationObserver: MutationObserver; // Modifications observer
  private innerTextBuffer: string; // Stores the last value
  private data: IEditableTextData;

  constructor(props: IEditableTextProps) {
    super(props);
    this.data = this.props.params.get(this.props.variable) as IEditableTextData;
    this.state = { update: 0 };
  }

  public onContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
  }

  public componentDidMount() {
    if (this.props.edit) {
      this.root.contentEditable = 'true';
      this.mutationObserver = new MutationObserver(this.onContentChange);
      this.mutationObserver.observe(this.root, {
        childList: true, // To check for new lines
        subtree: true, // To check for nested elements
        characterData: true // To check for text modifications
      });
    }
  }

  public render() {
    const len = this.data.content.length;
    const width = this.props.containersize.width;
    const height = this.props.containersize.height;

    const fontSize = this.calculateFontSize(this.data.fontSize, width, height, len);
    if (this.props.edit) {
      return (
        <Editable
          ref={this.onRootRef}
          containersize={this.props.containersize}
          origin={{ x: 0, y: 0 }}
          fontSize={fontSize}
          onMouseDown={this.onMouseDown}
          onKeyDown={this.onKeyDown}
        >
          {this.data.content}
        </Editable>
      );
    } else {
      return (
        <NotEditable
          ref={this.onRootRef}
          containersize={this.props.containersize}
          origin={{ x: 0, y: 0 }}
          fontSize={fontSize}
          onMouseDown={this.onMouseDown}
        >
          {this.data.content}
        </NotEditable>
      );
    }
  }

  private onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // capture the mouse
    event.stopPropagation();
  }

  private onKeyDown = (e: React.KeyboardEvent) => {
    if (e && e.key === 'Enter') {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  private onContentChange: MutationCallback = (mutations: MutationRecord[]) => {
    mutations.forEach(() => {
      // Get the text from the editable div
      // (Use innerHTML to get the HTML)
      const { innerText } = this.root;

      // Content changed will be triggered several times for one key stroke
      if (!this.innerTextBuffer || this.innerTextBuffer !== innerText) {
        // Update the font size
        this.data.fontSize = this.calculateFontSize(
          this.data.fontSize,
          this.props.containersize.width,
          this.props.containersize.height,
          innerText.length
        );
        // Update css
        this.root.style.fontSize = this.data.fontSize.toString();

        // Save content
        this.props.params.set(this.props.variable, {
          content: innerText,
          fontSize: this.data.fontSize,
          alpha: this.data.alpha
        });
        this.data.content = innerText;
        this.innerTextBuffer = innerText;
      }
    });
  }

  private onRootRef = (elt: HTMLDivElement) => {
    this.root = elt;
    this.setState({ update: this.state.update + 1 });
  }

  private calculateFontSize(fontSize: number | undefined, width: number, height: number, len: number) {
    /**
     * We want to scale the font size to fit the available
     * container size. This is a function of the text length,
     * and the container size. 
     * We need to solve the equations
     *  textWidth = textLength * averageFontWidth * fontSize
     *  textHeight = fontSize
     * 
     * subject to 
     *  textWidth < percentage of containerWidth
     *  textHeight < percentage of containerHeight
     * 
     * Initial average char width is alpha * fontSize
     * textWidth = alpha * fontSize * textLength
     * Average char width ranges from .3 to .5 of fontSize
     */

    if (fontSize === undefined) {
      fontSize = .95 * height;
    }

    if (this.data.alpha === undefined) {
      this.data.alpha = len * (.5 * fontSize!) / fontSize!;
    }

    if (this.root) {
      this.data.alpha = (this.root.offsetWidth / len) / fontSize;
    }

    const tw = () => {
      return len * this.data.alpha! * fontSize!;
    }

    const th = () => {
      return .95 * fontSize!;
    }

    let textWidth = tw();
    let textHeight = th();
    while (textWidth < width && textHeight < height) {
      fontSize += 1;
      textWidth = tw();
      textHeight = th();
    }

    while (textWidth >= width || textHeight >= height) {
      fontSize -= 1;
      textWidth = tw();
      textHeight = th();
    }

    this.data.fontSize = fontSize;
    return fontSize;
  }
}

