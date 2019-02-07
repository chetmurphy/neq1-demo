import {
  extendObservable,
  IObservableObject,
  observable,
  reaction,
  runInAction
} from 'mobx';

// Based on https://github.com/7upcat/mobx-event-bus and convertred to typescript

class EventBus {
  private _metadata: IObservableObject;

  constructor() {
    this._metadata = observable({});
  }

  // tslint:disable-next-line:no-any
  public register = (store: any) => {
    const { __subscriberMetadata } = store;
    if (__subscriberMetadata) {
      // tslint:disable-next-line:no-any
      __subscriberMetadata.forEach((s: any) => {
        if (!this._metadata[s.topic]) {
          const item = {};
          item[s.topic] = { seq: 0 };
          extendObservable(this._metadata, item);
          this._metadata[s.topic].event = {};
        }
        if (this._metadata[s.topic].seq > 0) {
          const { cb, selector } = s;
          if (!selector || selector(this._metadata[s.topic])) {
            runInAction(() => cb.apply(store, [this._metadata[s.topic]]));
          }
        }
        reaction(() => (this._metadata[s.topic].seq), (seq) => {
          if (seq > 0) {
            const { cb, selector } = s;
            if (!selector || selector(this._metadata[s.topic])) {
              // console.log('EventBus: reaction: ', s.topic);
              runInAction(() => cb.apply(store, [this._metadata[s.topic]]));
            }
          }
        });
      });
    }
  }

  public post = (topic: string, payload: string) => {
    if (topic) {
      if (!this._metadata[topic]) {
        const item = {};
        item[topic] = { seq: 0 };
        extendObservable(this._metadata, item);
      }
      runInAction(() => {
        this._metadata[topic].payload = payload;
        this._metadata[topic].seq = this._metadata[topic].seq + 1;
      });
    }
  }
}

export const eventBus = new EventBus();

// Decorator
// tslint:disable-next-line:no-any
export function subscribe(topic: string, selector?: (event: any) => boolean) {
  // tslint:disable-next-line:no-any
  return (target: any, name: string, descriptor: any) => {
    const cb = descriptor.value;
    const sub = { topic, selector, cb };
    if (!target.__subscribers) {
      target.__subscribers = [];
    }
    target.__subscribers.push(sub);
    Object.defineProperty(target, '__subscriberMetadata', { value: target.__subscribers });
    return descriptor;
  };
}
