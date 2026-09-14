import type { Pref } from '../../preference/types/latest';
import { browser } from '../browser';

export const setBadge = async (general: Pref['general']) => {
  const text = general.enabled ? 'ON' : 'OFF';
  const color = general.enabled ? '#2E8B57' : '#808080';
  const setText = browser.action.setBadgeText({ text });
  const setBg = browser.action.setBadgeBackgroundColor({ color });

  return Promise.all([setText, setBg]);
};
