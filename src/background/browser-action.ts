import { browser } from '../service/browser';
import { bgGetPref, bgSetPref } from './state/storage';

export function mountBrowserActionListener(): void {
  let clickQueue: Promise<void> = Promise.resolve();

  browser.action.onClicked.addListener(async () => {
    clickQueue = clickQueue
      .catch(() => undefined)
      .then(async () => {
        const pref = await bgGetPref();
        await bgSetPref({ general: { ...pref.general, enabled: !pref.general.enabled } });
      });
    return clickQueue;
  });
}
