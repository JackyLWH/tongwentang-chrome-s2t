import type { FC, Reducer } from 'react';
import { useReducer } from 'react';
import { AboutPage } from '../../pages/about/AboutPage';
import { GeneralPage } from '../../pages/general/GeneralPage';
import { WordPage } from '../../pages/word/WordPage';

export enum PageType {
  general = 'GENERAL',
  word = 'WORD',
  about = 'ABOUT',
}

export interface PageAction {
  type: PageType;
}

export interface PageState {
  type: PageType;
  node: FC;
}

const pageReducer: Reducer<PageState, PageAction> = (s, { type }) => {
  switch (type) {
    case PageType.general:
      return { type, node: GeneralPage };
    case PageType.word:
      return { type, node: WordPage };
    case PageType.about:
      return { type, node: AboutPage };
  }
};

export const usePage = () => useReducer(pageReducer, { type: PageType.general, node: GeneralPage });
