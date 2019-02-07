import * as mobx from 'mobx';

const { observable, action } = mobx;

export default class Store {

  @observable
  protected _ready: boolean = false;

  @action.bound
  public setReady() {
    this._ready = true;
  }

}