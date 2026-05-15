import { LocalStorageWrapper } from '@actiontech/dms-kit';
import { StorageKey } from '@actiontech/dms-kit';
import { compressToBase64 } from 'lz-string';
import { useEffect } from 'react';

const useSyncDmsCloudBeaverChannel = () => {
  useEffect(() => {
    let sqleEdition;
    // #if [ee]
    sqleEdition = 'ee';
    // #elif [ce]
    sqleEdition = 'ce';
    // #endif
    if (sqleEdition !== LocalStorageWrapper.get(StorageKey.DMS_CB_CHANNEL)) {
      LocalStorageWrapper.set(
        StorageKey.DMS_CB_CHANNEL,
        compressToBase64(
          JSON.stringify({ type: 'sqle_edition', data: sqleEdition })
        )
      );
    }
  }, []);
};

export default useSyncDmsCloudBeaverChannel;
