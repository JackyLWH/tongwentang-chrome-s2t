import { vctrl } from 'data-fixer';
import { z } from 'zod';
import { vldFn } from './validator';

export const isBoolean = (alt: boolean) => vctrl(vldFn(z.boolean()), alt);

export const isString = vctrl(vldFn(z.string()), '');
