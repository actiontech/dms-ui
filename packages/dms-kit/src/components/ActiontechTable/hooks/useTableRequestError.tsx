import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { getErrorMessage } from '../../../utils';

const useTableRequestError = () => {
  const [requestErrorMessage, setRequestErrorMessage] = useState('');

  function handleTableRequestError<
    T extends {
      data?: any[];
      code?: number;
      message?: string;
      total_nums?: number;
    },
    R = {
      list: NonNullable<T['data']>;
      total: number;
      otherData?: Record<string, any>;
    }
  >(request: Promise<AxiosResponse<T>>): Promise<R> {
    return request
      .then((response) => {
        setRequestErrorMessage('');
        const { data, total_nums, ...otherData } = response.data;

        const list = (data ?? []) as NonNullable<T['data']>;
        let total = 0;
        if (typeof total_nums === 'number') {
          total = total_nums;
        } else if (Array.isArray(list)) {
          total = list.length;
        }

        return { list, total, otherData } as R;
      })
      .catch((error) => {
        setRequestErrorMessage(getErrorMessage(error));
        // 因为此方法通常配合useRequest使用，所以需要抛出Error或者Promise.reject(error)
        // 否则会因为Promise的链式调用特性，直接return error会触发.then而不是.catch，导致useRequest的onError回调函数不会正确执行
        throw error instanceof Error ? error : new Error(String(error));
      });
  }

  return {
    requestErrorMessage,
    handleTableRequestError
  };
};

export default useTableRequestError;
