import type { Control } from 'data-fixer';
import { dctrl, rctrl, vctrl } from 'data-fixer';
import { z } from 'zod';
import type { Pref } from '../../types/latest';
import { isBoolean, isString } from '../controllers';
import { vldFn } from '../validator';

export const v3Schema: Control<Pref> = dctrl({
  version: vctrl<3>(vldFn(z.literal(3)), 3),
  meta: dctrl({ update: vctrl(vldFn(z.number().int()), Date.now()) }),
  general: dctrl({ enabled: isBoolean(true) }),
  word: dctrl({
    default: dctrl({ char: isBoolean(true), phrase: isBoolean(true) }),
    custom: rctrl(isString),
  }),
});
