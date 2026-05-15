import {
  IHighPriorityConditionResV1,
  IHighPriorityConditionReq
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useCallback } from 'react';
import { PrioritySqlConditionsParams } from '../../index.type';
import { HighPriorityConditionReqOperatorEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const usePriorityConditionsParams = () => {
  const generateSubmitDataWithFormValues = useCallback(
    (values?: PrioritySqlConditionsParams) => {
      const conditions: IHighPriorityConditionReq[] = [];
      if (!values) {
        return conditions;
      }
      Object.keys(values).forEach((key) => {
        const item = values[key];
        if (item.checked) {
          conditions.push({
            key,
            operator: item.operator,
            value: item.value
          });
        }
      });

      return conditions;
    },
    []
  );

  const generateFormValuesWithAPIResponse = useCallback(
    (
      response: IHighPriorityConditionResV1[],
      allConditions: IHighPriorityConditionResV1[]
    ) => {
      if (allConditions.length === 0) {
        return {} as PrioritySqlConditionsParams;
      }
      return allConditions.reduce<PrioritySqlConditionsParams>((acc, cur) => {
        const conditions = response.find((v) => v.key === cur.key);
        if (!conditions) {
          return {
            ...acc,
            [cur.key!]: {
              operator: cur.operator
                ?.operator_value as HighPriorityConditionReqOperatorEnum,
              value: cur.value ?? '',
              checked: false
            }
          };
        }
        return {
          ...acc,
          [conditions.key!]: {
            operator: conditions.operator
              ?.operator_value as HighPriorityConditionReqOperatorEnum,
            value: conditions.value ?? '',
            checked: true
          }
        };
      }, {});
    },
    []
  );

  return {
    generateSubmitDataWithFormValues,
    generateFormValuesWithAPIResponse
  };
};

export default usePriorityConditionsParams;
