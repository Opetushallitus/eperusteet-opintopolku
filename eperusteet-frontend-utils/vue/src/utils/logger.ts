import * as _ from 'lodash';

const Radius = '4px';
function pillRight(color: string) {
  return `
  background: ${color};
  margin-bottom: 2px;
  padding: 3px 5px 1px 5px;
  color: black;
  border-top-right-radius: ${Radius};
  border-bottom-right-radius: ${Radius};
  `;
}

const PillStyle = `
  font-weight: bold;
  background: #00526c;
  margin-bottom: 2px;
  padding: 3px 5px 1px 5px;
  border-top-left-radius: ${Radius};
  border-bottom-left-radius: ${Radius};
`;
const PillSuccess = pillRight('#e6ffc1');
const PillDebug = pillRight('#f6f4f0');
const PillError = pillRight('#e09191');
const PillWarning = pillRight('#fff7bc');
const PillInfo = pillRight('#def2ff');

abstract class Logger<T> {
  // eslint-disable-next-line
  public constructor(protected readonly name: string) { }
  public abstract error(...args: any[]): void;
  public abstract info(...args: any[]): void;
  public abstract warn(...args: any[]): void;
  public abstract debug(...args: any[]): void;
  public abstract success(...args: any[]): void;
  public abstract log(...args: any[]): void;

  protected impl(method: string, style: string, ...args: any[]) {
    // eslint-disable-next-line no-console
    (console as any)[method](`%c${this.name}%c${method}`, PillStyle, style, '»',
      ...args);
  }
}

// tslint:disable-next-line:max-classes-per-file
class DevLogger<T> extends Logger<T> {
  public constructor(readonly name: string) {
    super(name);
  }
  public error = (...args: any[]) => this.impl('error', PillError, ...args);
  public info = (...args: any[]) => this.impl('info', PillInfo, ...args);
  public warn = (...args: any[]) => this.impl('warn', PillWarning, ...args);
  public debug = (...args: any[]) => this.impl('debug', PillDebug, ...args);
  public success = (...args: any[]) => this.impl('log', PillSuccess, ...args);
  public log = (...args: any[]) => this.impl('log', PillDebug, ...args);
}

// tslint:disable-next-line:max-classes-per-file
class ProdLogger<T> extends Logger<T> {
  public info = _.noop;
  public debug = _.noop;
  public success = _.noop;
  public log = _.noop;

  public constructor(readonly name: string) {
    super(name);
  }

  // eslint-disable-next-line no-console
  public error = (...args: any[]) => console.error(...args);

  // eslint-disable-next-line no-console
  public warn = (...args: any[]) => console.warn(...args);
}

type Loggable<T> = new(...args: any[]) => T;

export function createLogger<T>(t: Loggable<T> | string) {
  const target = _.isString(t) ? t : (t as any).name;
  if (process.env.NODE_ENV === 'development') {
    return new DevLogger<T>(target);
  }
  else {
    return new ProdLogger<T>(target);
  }
}
