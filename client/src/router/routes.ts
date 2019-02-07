import { Route } from 'router5';

import { IEditHelperProps } from 'react-layout-generator';
import {introJSX} from '../pages/intro/Intro'

export interface IRouteNavigationProps {
  menuInverted: boolean;
}

// tslint:disable-next-line:no-empty-interface
export interface ISceneComponentProps {
}

export interface IExtendedRoute extends Route {
  component: (props: IEditHelperProps) => JSX.Element;
  sceneComponentProps: ISceneComponentProps;
  // onActivate?: (state: State) => Promise<{}>;
}

export const routes: IExtendedRoute[] = [
  { 
    name: 'intro', 
    path: '/intro', 
    component: introJSX,
    // navigationProps: { menuInverted: true },
    sceneComponentProps: {} 
  },
  // { 
  //   name: 'register', 
  //   path: '/register', 
  //   component: Register,
  //   navigationProps: { menuInverted: true },
  //   sceneComponentProps: {}
  // },
  // { 
  //   name: 'confirmEmail', 
  //   path: '/confirm-email?name&vcode', 
  //   component: ConfirmEmail,
  //   navigationProps: { menuInverted: true },
  //   sceneComponentProps: {}
  // },
  // { 
  //   name: 'newTile', 
  //   path: '/newTile', 
  //   component: NewTile,
  //   navigationProps: { menuInverted: true },
  //   sceneComponentProps: {}
  // },
  // {
  //   name: 'landing',
  //   path: '/',
  //   component: Landing,
  //   navigationProps: { menuInverted: true },
  //   sceneComponentProps: {}
  // },
  // {
  //   name: 'dashboard',
  //   path: '/dashboard',
  //   component: Dashboard,
  //   navigationProps: { menuInverted: false },
  //   sceneComponentProps: {}
  // },
  // {
  //   name: 'details',
  //   path: '/details/?:type&:id',
  //   component: Details,
  //   navigationProps: { menuInverted: false },
  //   sceneComponentProps: {}
  // }
];
