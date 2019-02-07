import JSONPrettify from './JSONPrettify';

class Logger {

  private _map: Map<string, boolean> = new Map;
  
  public enable(key: string) {
    this._map.set(key, true);
  }

  public disable(key: string) {
    this._map.set(key, true);
  }

  public enabled(key: string) {
    const condition = this._map.get(key);
    return condition ? condition : false;
  }

  public message(key: string, data: string): void {
    if ( this.enabled(key) && process.env.NODE_ENV  !== 'production') {
      console.log(data);
    }
  }

  public groupStart(key: string, title: string): void {
    if (this._map.get(key) && process.env.NODE_ENV  !== 'production') {
      if (!!console.groupCollapsed) {
        console.groupCollapsed(title);
      }
    }
  }

  public groupEnd(key: string): void {
    if (this._map.get(key) && process.env.NODE_ENV  !== 'production') {
      if (!!console.groupCollapsed) {
        console.groupEnd();
      }
    }
  }

  public log(key: string, title: string, data: any | undefined): void {
    if (this._map.get(key) && process.env.NODE_ENV !== 'production') {
      if (!!console.groupCollapsed) {
        console.groupCollapsed(title);
      }

      console.log(JSONPrettify(data));

      if (!!console.groupCollapsed) {
        console.groupEnd();
      }
    }
  }

  public logInfo(key: string, title: string, data: any): void {
    if (this._map.get(key) && process.env.NODE_ENV  !== 'production') {
      if (!!console.groupCollapsed) {
        console.groupCollapsed('%c' + title, 'color: blue; font-size:12px;');
      }

      console.log(JSONPrettify(data));

      if (!!console.groupCollapsed) {
        console.groupEnd();
      }
    }
  }

  public logImportant(key: string, title: string, data: any): void {
    if (this._map.get(key) && process.env.NODE_ENV  !== 'production') {
      if (!!console.groupCollapsed) {
        console.groupCollapsed('%c' + title, 'color: red; font-size:15px;');
      }

      console.log(JSONPrettify(data));

      if (!!console.groupCollapsed) {
        console.groupEnd();
      }
    }
  }
} 

const LOGGER = new Logger;

export default LOGGER;
