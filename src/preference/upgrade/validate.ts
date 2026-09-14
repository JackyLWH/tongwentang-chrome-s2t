import { v3Schema } from '../schema/v3';
import { normalizePref } from './upgrade-pref';

export const validatePref = (value: unknown) => v3Schema(normalizePref(value));
