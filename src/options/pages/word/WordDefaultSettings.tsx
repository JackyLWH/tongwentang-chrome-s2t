import type { ChangeEventHandler, FC } from 'react';
import { Fragment, useCallback } from 'react';
import type { PrefWordDefault } from '../../../preference/types/v3';
import { i18n } from '../../../service/i18n/i18n';
import { Button } from '../../components';
import { Checkbox } from '../../components/forms';

export const WordDefaultSettings: FC<{
  value: PrefWordDefault;
  onChange: (d: PrefWordDefault) => void;
  onSave: () => Promise<unknown>;
}> = ({ value: defWord, onChange: handleChange, onSave: handleSave }) => {
  const upSc: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => handleChange({ ...defWord, char: e.currentTarget.checked }),
    [handleChange, defWord],
  );
  const upSp: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => handleChange({ ...defWord, phrase: e.currentTarget.checked }),
    [handleChange, defWord],
  );

  return (
    <Fragment>
      <Checkbox
        isSwitch={true}
        label={i18n.getMessage('MSG_DEFAULT_S2T_CHAR')}
        checked={defWord.char}
        onChange={upSc}
      />
      <Checkbox
        isSwitch={true}
        label={i18n.getMessage('MSG_DEFAULT_S2T_WORD')}
        checked={defWord.phrase}
        onChange={upSp}
      />
      <Button type="primary" onClick={handleSave}>
        {i18n.getMessage('MSG_SAVE')}
      </Button>
    </Fragment>
  );
};
