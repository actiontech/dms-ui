import { renderHook } from '@testing-library/react';
import usePriorityConditionsParams from '../hooks';
import { HighPriorityConditionReqOperatorEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('test HighPriorityConditions/hooks', () => {
  it('should correctly generate submit data from form values', () => {
    const { result } = renderHook(() => usePriorityConditionsParams());

    expect(result.current.generateSubmitDataWithFormValues()).toEqual([]);
    expect(
      result.current.generateSubmitDataWithFormValues({
        audit_result: {
          value: 'warn',
          checked: true,
          operator: HighPriorityConditionReqOperatorEnum['>']
        },
        audit_time: {
          value: '',
          checked: false,
          operator: HighPriorityConditionReqOperatorEnum['=']
        }
      })
    ).toEqual([{ operator: '>', key: 'audit_result', value: 'warn' }]);
  });

  it('should accurately generate form values from API response', () => {
    const { result } = renderHook(() => usePriorityConditionsParams());
    expect(result.current.generateFormValuesWithAPIResponse([], [])).toEqual(
      {}
    );
    expect(
      result.current.generateFormValuesWithAPIResponse(
        [
          {
            key: 'query_time_avg',
            desc: '平均查询时间',
            value: '0.3',
            operator: {
              operator_value: '\u003e',
              operator_enums_value: [
                {
                  value: '\u003e',
                  desc: '大于'
                },
                {
                  value: '=',
                  desc: '等于'
                },
                {
                  value: '\u003c',
                  desc: '小于'
                }
              ]
            }
          },
          {
            key: 'row_examined_avg',
            desc: '平均扫描行数',
            value: '0.5',
            operator: {
              operator_value: '\u003e',
              operator_enums_value: [
                {
                  value: '\u003e',
                  desc: '大于'
                },
                {
                  value: '=',
                  desc: '等于'
                },
                {
                  value: '\u003c',
                  desc: '小于'
                }
              ]
            }
          }
        ],
        [
          {
            key: 'query_time_avg',
            desc: '平均查询时间',
            value: '10',
            operator: {
              operator_value: '\u003e',
              operator_enums_value: [
                {
                  value: '\u003e',
                  desc: '大于'
                },
                {
                  value: '=',
                  desc: '等于'
                },
                {
                  value: '\u003c',
                  desc: '小于'
                }
              ]
            }
          },
          {
            key: 'row_examined_avg',
            desc: '平均扫描行数',
            value: '100',
            operator: {
              operator_value: '\u003e',
              operator_enums_value: [
                {
                  value: '\u003e',
                  desc: '大于'
                },
                {
                  value: '=',
                  desc: '等于'
                },
                {
                  value: '\u003c',
                  desc: '小于'
                }
              ]
            }
          },
          {
            key: 'audit_level',
            desc: '告警级别',
            value: 'warn',
            enums_value: [
              {
                value: 'info',
                desc: '提示'
              },
              {
                value: 'warn',
                desc: '告警'
              },
              {
                value: 'error',
                desc: '错误'
              }
            ],
            operator: {
              operator_value: '\u003e',
              operator_enums_value: [
                {
                  value: '\u003e',
                  desc: '大于'
                },
                {
                  value: '=',
                  desc: '等于'
                },
                {
                  value: '\u003c',
                  desc: '小于'
                }
              ]
            }
          }
        ]
      )
    ).toEqual({
      audit_level: { operator: '>', checked: false, value: 'warn' },
      query_time_avg: { operator: '>', checked: true, value: '0.3' },
      row_examined_avg: {
        operator: '>',
        checked: true,
        value: '0.5'
      }
    });
  });
});
