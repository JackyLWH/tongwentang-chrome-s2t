import type { FC } from 'react';
import { useCallback, useState } from 'react';
import type { PrefWordDefault } from '../../../preference/types/v3';
import { i18n } from '../../../service/i18n/i18n';
import { createNoti } from '../../../service/notification/create-noti';
import { setStorage } from '../../../service/storage/storage';
import { Button, Divider, Modal } from '../../components';
import { useWord } from '../../hooks/word/use-word';
import { WordDefaultSettings } from './WordDefaultSettings';
import { WordEntryEditor } from './WordEntryEditor';
import { WordEntryList } from './WordEntryList';

export const WordSettings: FC = () => {
  const { word, setWord } = useWord();
  const [toEdit, setToEdit] = useState<[string, string]>(['', '']);
  const [isModal, setIsModal] = useState(false);

  const setDefault = useCallback(
    (value: PrefWordDefault) => setWord(previous => ({ ...previous, default: value })),
    [setWord],
  );
  const edit = useCallback((entry: [string, string] = ['', '']) => {
    setToEdit(entry);
    setIsModal(true);
  }, []);
  const update = useCallback(
    ([key, value]: [string, string]) => {
      if (!key.trim() || !value.trim()) return;
      setWord(previous => {
        const custom = { ...previous.custom };
        if (toEdit[0]) delete custom[toEdit[0]];
        custom[key] = value;
        return { ...previous, custom };
      });
      setIsModal(false);
    },
    [setWord, toEdit],
  );
  const remove = useCallback(
    (key: string) => {
      setWord(previous => {
        const custom = { ...previous.custom };
        delete custom[key];
        return { ...previous, custom };
      });
    },
    [setWord],
  );
  const save = useCallback(
    async () =>
      setStorage({ word }).then(
        () => createNoti(i18n.getMessage('MSG_UPDATE_COMPLETED')),
        () => createNoti(i18n.getMessage('MSG_UPDATE_FAILED')),
      ),
    [word],
  );

  return (
    <div className="panel">
      <div className="panel-body" style={{ padding: '1em', maxHeight: '60vh' }}>
        <WordDefaultSettings value={word.default} onChange={setDefault} onSave={save} />
        <Divider content={i18n.getMessage('MSG_CUSTOM_S2T')} />
        <Button type="primary" onClick={() => edit()}>
          {i18n.getMessage('MSG_ADD')}
        </Button>
        <Button type="primary" onClick={save}>
          {i18n.getMessage('MSG_SAVE')}
        </Button>
        <WordEntryList words={word.custom} onEdit={edit} onRemove={remove} />
      </div>
      <Modal isActive={isModal} onCancel={() => setIsModal(false)}>
        <WordEntryEditor entry={toEdit} onSubmit={update} />
      </Modal>
    </div>
  );
};
