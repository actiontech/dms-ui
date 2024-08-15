import {
  IHighPriorityCondition,
  IHighPriorityConditionReq
} from '@actiontech/shared/lib/api/sqle/service/common';
import { useCallback } from 'react';
import { PrioritySqlConditionsParams } from '../../index.type';
import { HighPriorityConditionReqBooleanOperatorEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

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
            boolean_operator: item.booleanOperator,
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
      response: IHighPriorityCondition[],
      allConditions: IHighPriorityCondition[]
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
              booleanOperator: cur.boolean_operator
                ?.boolean_operator_value as HighPriorityConditionReqBooleanOperatorEnum,
              value: cur.value ?? '',
              checked: false
            }
          };
        }
        return {
          ...acc,
          [conditions.key!]: {
            booleanOperator: conditions.boolean_operator
              ?.boolean_operator_value as HighPriorityConditionReqBooleanOperatorEnum,
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
