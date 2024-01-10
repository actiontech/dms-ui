import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useEffect, useState } from 'react';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const useChatsDataByAPI = <
  T extends {
    code?: number;
    message?: string;
  }
>(
  server: () => Promise<AxiosResponse<T>>,
  { onSuccess }: { onSuccess: (res: AxiosResponse<T>) => void }
) => {
  const { t } = useTranslation();
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Project_Overview,
      getData
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    startGetData();
    server()
      .then((res) => {
        if (res.data.code !== ResponseCode.SUCCESS) {
          setErrorMessage(res.data.message ?? t('common.unknownError'));
        } else {
          setErrorMessage('');
          onSuccess(res);
        }
      })
      .catch((error) => {
        setErrorMessage(error?.toString() ?? t('common.unknownError'));
      })
      .finally(() => {
        finishGetData();
      });
  };

  return {
    loading,
    errorMessage,
    getApiData: getData
  };
};

export default useChatsDataByAPI;
