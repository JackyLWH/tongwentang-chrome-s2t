import { v3Schema } from './schema/v3';
import type { Pref } from './types/latest';

// default TongWen preferences
export const getDefaultPref = (): Pref => v3Schema({}).value();
