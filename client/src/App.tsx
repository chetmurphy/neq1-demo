import * as React from "react"

import * as Sentry from "@sentry/browser";

import ReactMarkdown from "react-markdown";
// import { Params } from 'router5/types/types/base'
// import routerStore from './stores/RouterStore';

import styled from "styled-components";

// styles
import "highlight.js/styles/vs.css";

import {
  EditHelper,
  IGenerator,
  ServiceOptions
} from "@neq1/core";

import {desktopGenerator} from "@neq1/desktop-generator";

import {Layout} from "@neq1/layout";

import {IMetaDataArgs, Panel} from "@neq1/panel";

// Examples
import cssColor from "./assets/colors";
// import CardDeck from './carddeck/CardDeck';
// import Chart from './chart/Chart';
import ErrorBoundary from "./components/ErrorBoundary";
import NavBar from "./components/NavBar";
import ToolBar from "./components/ToolBar";
import Dashboard, {dashboardMarkdown} from "./pages/dashboard/Dashboard";
import Diagram, { diagramMarkdown } from "./pages/diagram/Diagram";
import Flying, { flyingMarkdown } from "./pages/flying/Flying";
// import DeskTop from './desktop/DeskTop';
// import Editable from './editable/Editable';
// import Grid from './grid/Grid';
import Intro, { introMarkdown } from "./pages/intro/Intro";
import Solitaire, { solitaireMarkdown } from "./pages/solitaire/Solitaire";

// Icons
import {
  FaBook,
  FaCode,
  FaGithub,
  FaInfoCircle,
  FaRegEdit,
  FaRegSave
} from "react-icons/fa";
import { IconBaseProps } from "react-icons/lib/iconBase";
import {
  MdContentCopy,
  MdContentCut,
  MdContentPaste,
  MdRedo,
  MdUndo
} from "react-icons/md";

// tslint:disable-next-line:variable-name
const Title = styled.h2`
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
  color: ${cssColor.light};
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  overflow: "hidden";
  word-break: keep-all;
`;

// tslint:disable-next-line:variable-name
export const Button = styled.button`
  font-size: 36;
  padding: 0;
  background: transparent;
  border: none;
  color: ${cssColor.light};
`;

Sentry.init({
  release: "react-layout-generator@0.5.11",
  dsn: "https://990e004f6c634ea2ac0cec00daa87f3b@sentry.io/1409701"
});

// tslint:disable-next-line:max-classes-per-file
export default class App extends React.Component<
  {},
  {
    app: JSX.Element;
    info: boolean;
    markdown: () => string;
    markdownView: boolean;
    update: number;
  }
> {
  public g: IGenerator;

  private editHelper: EditHelper;

  constructor(props: any) {
    super(props);

    this.g = desktopGenerator("index");
    const p = this.g.params();

    // Set variables to 0 to hide section
    p.set("titleHeight", 60);
    p.set("headerHeight", 20);
    p.set("footerHeight", 0);
    p.set("leftSideWidth", 40);
    p.set("rightSideWidth", 0);

    // Show full width header and footer
    p.set("fullWidthHeaders", 1);

    // this.n = columnsGenerator("navbar");

    this.editHelper = new EditHelper();
    this.state = {
      app: <Intro editHelper={this.getEditHelper} />,
      info: false,
      markdown: introMarkdown,
      markdownView: true,
      update: 0
    };
  }

  // tslint:disable-next-line:member-ordering
  public resize = () => {
    this.updateInfo(true);
  };

  public componentDidMount() {
    window.addEventListener("resize", this.resize);
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  public select = (element: JSX.Element, markdown: () => string) => {
    this.editHelper.clear();
    this.setState({ app: element, markdown });
  };

  // public link = (name: string, routeParams: Params) => {
  //   this.editHelper.clear();
  //   routerStore.navigate(name, routeParams)
  // }

  public getEditHelper = () => {
    return this.editHelper;
  };

  public render() {
    return (
      <ErrorBoundary>
        <Layout
          name="framework"
          service={ServiceOptions.none}
          g={this.g}
          overflowX={'hidden'}
          overflowY={'hidden'}
        >
          <Panel
            data-layout={{ name: "title" }}
            style={{ backgroundColor: cssColor.dark, textAlign: "center" }}
          >
            {(args: IMetaDataArgs) => (
              <Title>React Layout Generator Examples</Title>
            )}
          </Panel>

          <div
            data-layout={{
              name: "appInfo",
              origin: { x: 1, y: 0 },
              location: { right: 10, top: 10, width: 24, height: 24 }
            }}
            onClick={this.onAppInfoClick}
          >
            <FaInfoCircle
              style={{
                fontSize: 24,
                padding: 0,
                background: "transparent",
                border: "none",
                color: "yellow"
              }}
            />
          </div>

          <div
            data-layout={{ name: "header" }}
            style={{ backgroundColor: cssColor.dark }}
          >
            <NavBar
              elements={[
                // if props change then the props should be functions that return the correct value
                {
                  component: (
                    <Intro
                      editHelper={this.getEditHelper}
                      onUpdate={this.onUpdate}
                    />
                  ),
                  markdown: introMarkdown,
                  name: "Home"
                },
                // { component: <DeskTop editHelper={this.getEditHelper} />, name: 'DeskTop' },
                // { component: <CardDeck editHelper={this.getEditHelper} />, name: 'CardDeck' },
                {
                  component: (
                    <Solitaire
                      editHelper={this.getEditHelper}
                      onUpdate={this.onUpdate}
                    />
                  ),
                  markdown: solitaireMarkdown,
                  name: "Drag/Drop"
                },
                {
                  component: (
                    <Diagram
                      editHelper={this.getEditHelper}
                      onUpdate={this.onUpdate}
                    />
                  ),
                  markdown: diagramMarkdown,
                  name: "Diagram"
                },
                {
                  component: (
                    <Flying
                      editHelper={this.getEditHelper}
                      onUpdate={this.onUpdate}
                    />
                  ),
                  markdown: flyingMarkdown,
                  name: "Game"
                },
                {
                  component: (
                    <Dashboard
                      editHelper={this.getEditHelper}
                      onUpdate={this.onUpdate}
                    />
                  ),
                  markdown: dashboardMarkdown,
                  name: "Dashboard"
                }
                // { component: <Solitaire2 editHelper={this.getEditHelper} />, name: 'Solitaire2' },
                // { component: <Grid editHelper={this.getEditHelper} />, name: 'Grid' },
                // { component: <Chart editHelper={this.getEditHelper} />, name: 'Chart' },
                // { component: <Editable editHelper={this.getEditHelper} />, name: 'Editable' },
              ]}
              callback={this.select}
            />
          </div>

          <div
            data-layout={{ name: "leftSide" }}
            style={{ backgroundColor: cssColor.dark }}
          >
            <ToolBar
              editHelper={this.editHelper}
              commands={[
                // These just define the buttons for the toolbar - behavior is controlled by EditHelpers
                { component: FaRegEdit, name: "edit" },
                { component: FaRegSave, name: "save" },
                { component: this.separator, name: "" },
                { component: MdUndo, name: "undo" },
                { component: MdRedo, name: "redo" },
                { component: this.separator, name: "" },
                { component: MdContentCut, name: "cut" },
                { component: MdContentCopy, name: "copy" },
                { component: MdContentPaste, name: "paste" },
                { component: this.separator, name: "" }
              ]}
            />
          </div>

          <div
            data-layout={{ name: "rightSide" }}
            style={{
              backgroundColor: "LightYellow",
              padding: 5,
              overflowX: "hidden",
              overflowY: "scroll"
            }}
          >
            <ReactMarkdown source={this.state.markdown()} />
          </div>

          <div
            data-layout={{ name: "footer" }}
            style={{
              backgroundColor: "LightYellow",
              padding: 5,
              overflowX: "hidden",
              overflowY: "scroll"
            }}
          >
            <ReactMarkdown source={this.state.markdown()} />
          </div>

          <div data-layout={{ name: "content" }}>{this.state.app}</div>

        </Layout>
        {this.overlay()}
      </ErrorBoundary>
    );
  }

  private onUpdate = () => {
    this.setState({ update: this.state.update + 1 });
  };

  private separator = (props: IconBaseProps & { key: string }) => {
    const fontSize =
      typeof props.fontSize === "string"
        ? parseInt(props.fontSize, 10)
        : props.fontSize!;
    const mid = fontSize / 2;
    return (
      <svg
        key={props.key}
        data-layout={props["data-layout"]}
        width={props.fontSize}
        height={mid}
      >
        <line
          x1="0"
          y1={mid / 2}
          x2={props.fontSize}
          y2={mid / 2}
          style={{
            stroke: props.color,
            strokeWidth: "1"
          }}
        />
      </svg>
    );
  };

  private onAppInfoClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    this.updateInfo();
  };

  private updateInfo(resize?: boolean) {
    const p = this.g.params();
    if (resize) {
      if (this.state.info) {
        let side = false;
        if (window.innerHeight < window.innerWidth) {
          p.set("rightSideWidth", 0.3 * window.innerWidth);
          p.set("footerHeight", 0);
          side = true;
        } else {
          p.set("footerHeight", 0.3 * window.innerHeight);
          p.set("rightSideWidth", 0);
        }
        this.setState({ info: true, markdownView: side });
      }
    } else {
      if (!this.state.info) {
        let side = false;
        if (window.innerHeight < window.innerWidth) {
          p.set("rightSideWidth", 0.3 * window.innerWidth);
          p.set("footerHeight", 0);
          side = true;
        } else {
          p.set("footerHeight", 0.3 * window.innerHeight);
          p.set("rightSideWidth", 0);
        }
        this.setState({ info: true, markdownView: side });
      } else {
        p.set("rightSideWidth", 0);
        p.set("footerHeight", 0);
        this.setState({ info: false });
      }
    }
  }

  private overlay() {
    const offset = 20;
    return (
      <Layout
        name={"Layout.intro.example.overlay"}
        g={this.g}
        overflowX={'hidden'}
        overflowY={'hidden'}
        style={{ pointerEvents: "none" }}
      >
        <div
          data-layout={{
            name: "implementation",
            location: { right: offset, bottom: offset, width: 100, height: 12 }
          }}
          style={{ fontSize: 12, textAlign: "right" }}
        >
          {`${process.env.REACT_APP_RLG_VERSION}`}
        </div>

        <a
          data-layout={{
            name: "github",
            location: {
              right: offset + 2 * 20,
              bottom: offset + 16,
              width: 16,
              height: 16
            }
          }}
          href="https://github.com/chetmurphy/RLG-Demo"
        >
          <FaCode
            style={{
              fontSize: 16,
              padding: 0,
              background: "transparent",
              border: "none",
              color: "olive"
            }}
          />
        </a>

        <a
          data-layout={{
            name: "Demo",
            location: {
              right: offset + 1 * 20,
              bottom: offset + 16,
              width: 16,
              height: 16
            }
          }}
          href="https://github.com/chetmurphy/react-layout-generator"
        >
          <FaGithub
            style={{
              fontSize: 16,
              padding: 0,
              background: "transparent",
              border: "none",
              color: "olive"
            }}
          />
        </a>

        <a
          data-layout={{
            name: "Docs",
            location: {
              right: offset,
              bottom: offset + 16,
              width: 16,
              height: 16
            }
          }}
          href="https://chetmurphy.github.io/react-layout-generator/"
        >
          <FaBook
            style={{
              fontSize: 16,
              padding: 0,
              background: "transparent",
              border: "none",
              color: "olive"
            }}
          />
        </a>
      </Layout>
    );
  }
}
