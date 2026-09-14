import { getRandomId } from '../../utilities';
import { browser } from '../browser';
import { i18n } from '../i18n/i18n';

export const createNoti = async (message: string, closeIn = 5000, id = getRandomId()) => {
  const createdId = await browser.notifications.create(id, {
    type: 'basic',
    title: i18n.getMessage('MSG_EXT_NAME'),
    message,
    iconUrl: 'icons/tongwen-icon-48.png',
  });
  setTimeout(() => {
    void browser.notifications.clear(createdId).catch(console.error);
  }, closeIn);
  return createdId;
};
