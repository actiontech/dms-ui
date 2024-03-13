import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { getErrorMessage } from '../../../utils/Common';

const useTableRequestError = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('');

  function handleTableRequestError<
    T extends {
      data?: any[];
      code?: number;
      message?: string;
      total_nums?: number;
    },
    R = { list: T['data']; total: number; otherData?: Record<string, any> }
  >(request: Promise<AxiosResponse<T>>): Promise<R> {
    return request
      .then((response) => {
        setRequestErrorMessage('');
        if ('data' in response.data && 'total_nums' in response.data) {
          const { data, total_nums, ...otherData } = response.data;
          return {
            list: response.data.data ?? [],
            total: response.data?.total_nums ?? 0,
            otherData
          };
        } else if ('data' in response.data) {
          const { data, total_nums, ...otherData } = response.data;
          return {
            list: response.data.data ?? [],
            total: response.data.data?.length ?? 0,
            otherData
          };
        }
      })
      .catch((error) => {
        setRequestErrorMessage(getErrorMessage(error));
        return error;
      });
  }

  return {
    requestErrorMessage,
    handleTableRequestError
  };
};

export default useTableRequestError;
