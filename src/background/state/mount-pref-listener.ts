import { listenStorage } from '../../service/storage/storage';
import { bgHandlePrefUpdate } from './storage';

export function mountPrefListener() {
  listenStorage(
    changes => {
      bgHandlePrefUpdate(changes);
    },
    { areaName: ['local'] },
  );
}
