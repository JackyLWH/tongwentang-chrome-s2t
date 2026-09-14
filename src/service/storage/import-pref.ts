import { safeUpgradePref, validatePref } from '../../preference/upgrade';
import { i18n } from '../i18n/i18n';
import { createNoti } from '../notification/create-noti';
import { resetStorage } from './storage';

export const importPref = async (raw: string): Promise<string> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return createNoti(i18n.getMessage('MSG_JSON_ERROR'));
  }

  try {
    const holder = validatePref(parsed);
    if (holder.invalid && !confirm(i18n.getMessage('MSG_CONFIRM_FIX_IMPORT'))) {
      return createNoti(i18n.getMessage('MSG_IMPORT_CANCELED'));
    }
    await resetStorage(safeUpgradePref(holder.value()));
    return createNoti(i18n.getMessage('MSG_IMPORT_COMPLETED'));
  } catch {
    return createNoti(i18n.getMessage('MSG_IMPORT_FAILED'));
  }
};
