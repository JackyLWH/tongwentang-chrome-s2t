import { safeUpgradePref } from '../../preference/upgrade';
import { browser } from '../browser';
import { i18n } from '../i18n/i18n';
import { createNoti } from '../notification/create-noti';
import { getStorage } from './storage';

const delayRevoke = (url: string) =>
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);

export const exportPref = async () =>
  getStorage()
    .then(pref => safeUpgradePref(pref))
    .then(pref => new Blob([JSON.stringify(pref, null, 2)], { type: 'application/json;charset=utf-8' }))
    .then(blob => URL.createObjectURL(blob))
    .then(url => (delayRevoke(url), url))
    .then(url => ({ url, filename: 'tongwentang-pref.json', saveAs: true }))
    .then(options => browser.downloads.download(options))
    .catch(async () => createNoti(i18n.getMessage('MSG_EXPORT_FAILED')));
