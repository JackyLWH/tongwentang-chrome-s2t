import { mountBrowserActionListener } from './browser-action';
import { mountPrefListener } from './state/mount-pref-listener';
import { bgInitialPref } from './state/storage';
import { browser } from '../service/browser';

mountPrefListener();
mountBrowserActionListener();
browser.runtime.onStartup.addListener(() => {
  void bgInitialPref().catch(console.error);
});
void bgInitialPref().catch(console.error);
