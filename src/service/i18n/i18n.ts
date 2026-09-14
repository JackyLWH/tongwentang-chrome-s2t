import { browser } from '../browser';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace i18n {
  export const getMessage = (name: string): string => browser.i18n.getMessage(name);
}
