import * as mobx from 'mobx';
import * as PouchDb from 'pouchdb-browser';

// import JSONPrettify from '../utils/JSONPrettify';
// import { resolve } from 'path';

// import LOGGER from '../../utils/logger';

interface IDB {
  local: PouchDB.Database;
  remote: PouchDB.Database | null;
  name: string;
  password: string;
}

const db: IDB = {
  local: new PouchDb('neq1:default'),
  remote: null,
  name: '',
  password: ''
};

const { observable, action } = mobx;

export interface IDocument {
  _id: string;
  _rev?: string;
  value?: number;
  // tslint:disable-next-line:no-any
  [key: string]: any;
}

interface IPouchDBDoc {
  _id: string;
  _rev?: string;
}

interface IDatabaseResult<T> {
  document?: T;
  error?: Error;
}

export class Database {

  @observable
  private _ready: boolean;

  private _db: typeof db.local;

  constructor() {
    this._db = db.local;
  }

  get ready() {
    return this._ready
  }

  get db() {
    return this._db;
  }

 public async getDocument<T extends IPouchDBDoc>(id: string): Promise<IDatabaseResult<T>> {

    // tslint:disable-next-line:no-debugger
    // debugger; 

    let r: T;
    let e: Error;
    try {
      r = await this.db.get<T>(id);
    } catch (err) {
      e = err;
    }

    return new Promise<IDatabaseResult<T>>(resolve => {
      resolve({ document: r, error: e });
    });
  }

 public async defineDocument<T extends IPouchDBDoc>(document: T & {}): Promise<IDatabaseResult<T>> {
    // tslint:disable-next-line:no-debugger
    // debugger;

    let r: T;
    let e: Error;
    try {
      r = await this.db.get<T>(document._id);
      if (r._rev && parseInt(r._rev, 10) <= 1) {
        document._rev = r._rev;
        await this.db.put(document);
      }
    } catch (err) {
      if (err.name === 'not_found') {
        await this.db.put<T>(document);
      }
      e = err;
    }

    return new Promise<IDatabaseResult<T>>(resolve => {
      resolve({ document: r, error: e });
    });
  }

  public setDocument<T extends IPouchDBDoc>(document: T & {}) {
    try {
      this.db.get(document._id)
        .then((result) => {
          document._rev = result._rev;
          this.db.put(document);
        })
        .catch((err: Error) => {
          if (err.name === 'not_found') {
            // console.log('setDocument catch 1', err);
            this.db.put<T>(document);
          } else {
            // tslint:disable-next-line:no-console
            console.log('setDocument catch 2', err);
            throw (err);
          }
        });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log('setDocument catch 3', err);
      throw (err);
    }
  }

  @action
  public setReady() {
    this._ready = true;
  }
}

const database = new Database();
export default database;