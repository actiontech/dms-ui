import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup
} from '@testing-library/react';
import {
  mockUseRuleType,
  rejectThreeSecond,
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useRuleType from '.';
import {
  RuleParamResV1TypeEnum,
  RuleResV1LevelEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('useRuleType', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const ruleTypes = [
    {
      rule_count: 0,
      rule_type: 'DML1'
    },
    {
      rule_count: 3,
      rule_type: 'DML2'
    }
  ];

  it('should get ruleTypeList data from request', async () => {
    const requestSpy = mockUseRuleType();
    requestSpy.mockImplementation(() => resolveThreeSecond(ruleTypes));
    const { result, waitForNextUpdate } = renderHook(() => useRuleType());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTypeList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateRuleTypeSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateRuleTypeList('oracle');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      db_type: 'oracle'
    });
    expect(result.current.ruleTypeList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateRuleTypeSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('DML1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  it('should set list to empty array when response code is not equal success code', async () => {
    const requestSpy = mockUseRuleType();
    requestSpy.mockImplementation(() => resolveThreeSecond(ruleTypes));
    const { result, waitForNextUpdate } = renderHook(() => useRuleType());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTypeList).toEqual([]);

    act(() => {
      result.current.updateRuleTypeList('oracle');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() => resolveErrorThreeSecond(ruleTypes));

    act(() => {
      result.current.updateRuleTypeList('oracle');
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual([]);
  });

  it('should set list to empty array when response throw error', async () => {
    const requestSpy = mockUseRuleType();
    requestSpy.mockImplementation(() => resolveThreeSecond(ruleTypes));
    const { result, waitForNextUpdate } = renderHook(() => useRuleType());
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTypeList).toEqual([]);

    act(() => {
      result.current.updateRuleTypeList('mysql');
    });

    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);
    requestSpy.mockClear();
    requestSpy.mockImplementation(() => rejectThreeSecond(ruleTypes));

    act(() => {
      result.current.updateRuleTypeList('mysql');
    });
    expect(result.current.loading).toBe(true);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual(ruleTypes);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.ruleTypeList).toEqual([]);
  });

  it('should generate the correct rule type data source from the provided rules', () => {
    const { result } = renderHook(() => useRuleType());

    act(() => {
      result.current.getRuleTypeDataSource(
        [
          {
            type: '使用建议'
          },
          {
            type: 'DML规范'
          },
          {
            type: 'DDL规范'
          },
          {
            type: '使用建议'
          },
          {
            type: ''
          }
        ],
        [
          {
            rule_name: 'all_check_prepare_statement_placeholders',
            desc: '绑定的变量个数不建议超过阈值',
            annotation:
              '因为过度使用绑定变量会增加查询的复杂度，从而降低查询性能。过度使用绑定变量还会增加维护成本。默认阈值:100',
            level: RuleResV1LevelEnum.error,
            type: '使用建议',
            db_type: 'MySQL',
            params: [
              {
                key: 'first_key',
                value: '100',
                desc: '最大绑定变量数量',
                type: RuleParamResV1TypeEnum.int
              }
            ],
            is_custom_rule: false,
            has_audit_power: true,
            has_rewrite_power: false
          },
          {
            rule_name: 'all_check_where_is_invalid',
            desc: '禁止使用没有WHERE条件或者WHERE条件恒为TRUE的SQL',
            annotation:
              'SQL缺少WHERE条件在执行时会进行全表扫描产生额外开销，建议在大数据量高并发环境下开启，避免影响数据库查询性能',
            level: RuleResV1LevelEnum.error,
            type: 'DML规范',
            db_type: 'MySQL',
            is_custom_rule: false,
            has_audit_power: true,
            has_rewrite_power: false
          },
          {
            rule_name: 'ddl_avoid_event',
            desc: '禁止使用event',
            annotation:
              '使用event会增加数据库的维护难度和依赖性，并且也会造成安全问题。',
            level: RuleResV1LevelEnum.error,
            type: '使用建议',
            db_type: 'MySQL',
            is_custom_rule: false,
            has_audit_power: true,
            has_rewrite_power: false
          },
          {
            rule_name: 'ddl_avoid_full_text',
            desc: '禁止使用全文索引',
            annotation:
              '全文索引的使用会增加存储开销，并对写操作性能产生一定影响。',
            level: RuleResV1LevelEnum.error,
            type: '使用建议',
            db_type: 'MySQL',
            is_custom_rule: false,
            has_audit_power: true,
            has_rewrite_power: false
          },
          {
            rule_name: 'ddl_avoid_geometry',
            desc: '禁止使用空间字段和空间索引',
            annotation:
              '使用空间字段和空间索引会增加存储需求，对数据库性能造成一定影响',
            level: RuleResV1LevelEnum.error,
            type: '使用建议',
            db_type: 'MySQL',
            is_custom_rule: false,
            has_audit_power: true,
            has_rewrite_power: false
          },
          {
            rule_name: 'ddl_check_char_length',
            desc: '禁止char, varchar类型字段字符长度总和超过阈值',
            annotation:
              '使用过长或者过多的varchar，char字段可能会增加业务逻辑的复杂性；如果字段平均长度过大时，会占用更多的存储空间。',
            level: RuleResV1LevelEnum.error,
            type: '使用建议',
            db_type: 'MySQL',
            params: [
              {
                key: 'first_key',
                value: '2000',
                desc: '字符长度',
                type: RuleParamResV1TypeEnum.int
              }
            ],
            is_custom_rule: false,
            has_audit_power: true,
            has_rewrite_power: false
          },
          {
            rule_name: 'ddl_check_column_blob_default_is_not_null',
            desc: 'BLOB 和 TEXT 类型的字段默认值只能为NULL',
            annotation:
              '在SQL_MODE严格模式下BLOB 和 TEXT 类型无法设置默认值，如插入数据不指定值，字段会被设置为NULL',
            level: RuleResV1LevelEnum.error,
            type: '',
            db_type: 'MySQL',
            is_custom_rule: false,
            has_audit_power: true,
            has_rewrite_power: false
          }
        ]
      );
    });

    expect(result.current.ruleTypeData).toEqual([
      {
        len: 5,
        rule_type: '使用建议'
      },
      {
        len: 1,
        rule_type: 'DML规范'
      },
      {
        len: 0,
        rule_type: 'DDL规范'
      }
    ]);
  });
});
