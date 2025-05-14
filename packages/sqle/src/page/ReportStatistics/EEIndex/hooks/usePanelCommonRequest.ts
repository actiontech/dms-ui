import { ResponseCode } from '@actiontech/shared/lib/enum';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';

const usePanelCommonRequest = <
  T extends {
    code?: number;
    message?: string;
  }
>(
  server: () => Promise<AxiosResponse<T>>,
  { onSuccess }: { onSuccess: (res: AxiosResponse<T>) => void },
  noDispatchEmitter = false
) => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const { unsubscribe } = eventEmitter.subscribe(
      EmitterKey.Refresh_Report_Statistics,
      () => {
        if (!noDispatchEmitter) {
          getData();
        }
      }
    );
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    setLoading(true);
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
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    errorMessage,
    getApiData: getData
  };
};
export default usePanelCommonRequest;
