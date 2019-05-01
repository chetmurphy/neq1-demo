/**
 * See https://vincent.is/post/testing-a-different-spa-routing/
 */

import * as mobx from 'mobx';
import { createRouter, NavigationOptions, PluginFactory, Router, State } from 'router5';
import browserPlugin from 'router5-plugin-browser';
import { Params } from 'router5/types/types/base'
// import { MiddlewareFactory } from 'router5/types/types/router'

import { IExtendedRoute, routes } from '../router/routes';
// import { SceneComponentProps } from '../scenes/types';

import database from './database/Database';

import { IEditHelperProps } from '@neq1/core';
import { eventBus, subscribe } from '../utils/EventBus';
import Store from './Store';

// import JSONPrettify from '../utils/JSONPrettify';

// import { checkIfStateModificationsAreAllowed } from 'mobx/lib/core/derivation';

const { observable, action } = mobx;

interface IStateDoc {
  _id: string;
  _rev?: string;
  state: State;
}

type JSXType = (props: IEditHelperProps) => JSX.Element;

class RouterStore extends Store {

  private routeDispatchMap: Map<string, IExtendedRoute>;

  @observable
  private _changed: number;

  @observable 
  private _current: IStateDoc = {
    _id: '_local/RouterState',
    state: {
      name: '',
      params: {},
      path: ''
    }
  };

  private _router: Router;
  private _popups: JSXType[] = [];

  constructor() {
    super();

    this.routeDispatchMap = new Map;

    // console.log(`RouterStore routes ${JSONPrettify(routes)}`);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i] as IExtendedRoute;
      this.routeDispatchMap.set(routes[i].name, route);
    }

    this._router = createRouter(routes);
    this._router.usePlugin(browserPlugin(), mobxRouterPlugin as PluginFactory);
    // this._router.useMiddleware(asyncMiddleware(routes));

    eventBus.register(this);
    mobx.runInAction(async () => {
      this.rehydrateState();
    });
    this._changed = 0;
  }

  public start() {
    this._router.start();
  }

  // Called after transition
  @action 
  public setCurrent(state: State) {
    if (this._ready) {
      this.update();
      this._current.state = state;
      database.setDocument(this._current);
    }
  }

  @subscribe('navigate')
  @action 
  public navigate(routeName: string, routeParams: Params) {
    // console.log('Router navigate to ', routeName, routeParams);
    this.update();
    this._router.navigate(routeName, routeParams);
  }

  @action 
  public rehydrateState() {

    // console.log('RouterStore.rehydrateState window.location.pathname: ', window.location.pathname);
    // TODO remove logic
    if (window.location.pathname !== '/foo') {
      // Use the path
      this.setReady();
      return;
    }
    // console.log('RouterStore.rehydrateState enter', this.current);

    // If state is updated also update navigationReady to avoid one update
    // for state and a separate update for navigationReady. If there is no
    // rehydrateState just update navigationReady.
    database.db.get<IStateDoc>(this._current._id)
      // tslint:disable-next-line:no-any
      .then((result: IStateDoc) => {
        if (this._current.state.name === '' && result && result.state.name) {
          this._router.start(result.state);
          this.updateNavigationState(result.state, true);
        }
        this.setReady();
      })
      // tslint:disable-next-line:no-any
      .catch((err: Error) => {
        if (err.name === 'not_found') {
          this.setReady();
        } else {
          console.log('RouterStore.rehydrateState Error ', err);
        }
      });
    const state = this._router.getState();
    // console.log('RouterStore rehydrateState state.path: ' + state ? 'null' : state.path);
    if (state && state.path !== this._current.state.path) {
      this.update();
    }
    // console.log('RouterStore.rehydrateState leave', this.current);
  }

  @action 
  public pushPopup = (component: string) => {
    const c = this.routeDispatchMap.get(component);
    if (c) {
      // console.log(`RouterStore pushPopup ${component}`);
      this._popups.push(c.component);
      this.update();
    } else {
      console.log(`RouterStore pushPopup for ${component} not defined`);
    }
  }

  @action 
  public popPopup = () => {
    if (this._popups.length) {
      // console.log(`RouterStore popPopup`);
      this.update();
      return this._popups.pop();
    }
    return null;
  }

  get changed() {
    return this._changed
  }

  get state() {
    return this._router.getState();
  }

  get popups() {
    return this._popups;
  }

  @action 
  public update = () => {
    this._changed += 1;
  }

  @subscribe('navigatePopup')
  // tslint:disable-next-line:no-any
  public navigatePopup(event: any) {
    this.pushPopup(event.payload);
    this.update();
  }

  @action.bound
  private updateNavigationState(state: State, ready: boolean = false) {
    this._current.state = state;
    this._router.navigate(state.name);
    if (ready) {
      this.setReady();
    }
  }
}

// Plugin: Tell MobX routerStore which page we're on
function mobxRouterPlugin(router: Router) {
  return {
    // tslint:disable-next-line:no-any
    onTransitionError: (toState: State, fromState: State, err: any) => {
      // TODO handle that.
      // console.log(`mobxRouterPlugin err: `, JSONPrettify(err));
      // console.log(`mobxRouterPlugin toState: `, JSONPrettify(toState));
      // console.log(`mobxRouterPlugin fromState: `, JSONPrettify(fromState));
    },
    onTransitionSuccess: (toState: State, fromState: State, ops: NavigationOptions) => {
      // console.log(`mobxRouterPlugin toState: `, JSONPrettify(toState));
      // console.log(`mobxRouterPlugin fromState: `, JSONPrettify(_fromState));
      routerStore.setCurrent(toState);
    }
  };
}
(mobxRouterPlugin as any).pluginName = 'MOBX_PLUGIN';

const routerStore: RouterStore = new RouterStore();
routerStore.start();
export default routerStore;