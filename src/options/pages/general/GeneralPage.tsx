import type { FC } from 'react';
import { i18n } from '../../../service/i18n/i18n';
import { Page } from '../../components';
import { Preferences } from './Preferences';

export const GeneralPage: FC = () => {
  return (
    <Page title={i18n.getMessage('MSG_GENERAL')}>
      <Preferences />
    </Page>
  );
};
