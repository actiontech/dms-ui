import { AuditPlanParamResV1TypeEnum } from '../../api/sqle/service/common.enum';
import {
  BackendFormRequestParams,
  BackendFormValues,
  BackendFormItemParams
} from './index.type';
import { useCallback } from 'react';

const useAsyncParams = () => {
  const mergeFromValueIntoParams = useCallback(
    (
      value: BackendFormValues,
      params: BackendFormItemParams[]
    ): BackendFormRequestParams[] => {
      return params.map((item) => {
        const temp = {
          key: item.key,
          value: item.value
        };
        if (item.key && Object.prototype.hasOwnProperty.call(value, item.key)) {
          const tempVal = value[item.key];
          if (typeof tempVal === 'boolean') {
            temp.value = tempVal ? 'true' : 'false';
          } else {
            temp.value = String(tempVal);
          }
        }
        return temp;
      });
    },
    []
  );

  const generateFormValueByParams = useCallback(
    <T extends { key?: string; value?: string; type?: string }>(
      params: T[]
    ): BackendFormValues => {
      const value: BackendFormValues = {};
      params.forEach((item) => {
        if (item.key) {
          if (item.type === AuditPlanParamResV1TypeEnum.bool) {
            value[item.key] = item.value === 'true' ? true : false;
          } else {
            value[item.key] = item.value ?? '';
          }
        }
      });
      return value;
    },
    []
  );

  return {
    mergeFromValueIntoParams,
    generateFormValueByParams
  };
};

export default useAsyncParams;
