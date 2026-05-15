import { cleanup, renderHook } from '@testing-library/react';
import useRuleFilterForm from '../hooks/useRuleFilterForm';
import { Form } from 'antd';
import { RuleFilterFieldsType } from '../../index.type';
import { NamePath } from 'antd/es/form/interface';

describe('sqle/components/RuleList/useRuleFilterForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render no other form', () => {
    const mockFormValue: RuleFilterFieldsType = {
      fuzzy_keyword: 'keyword',
      operand: 'table',
      audit_purpose: 'security',
      audit_accuracy: 'offline',
      sql: 'dcl',
      performance_cost: ' high'
    };
    jest.spyOn(Form, 'useWatch').mockImplementation((key: NamePath) => {
      return mockFormValue[key as keyof RuleFilterFieldsType];
    });
    const { result } = renderHook(() => useRuleFilterForm());
    expect(result.current.fuzzyKeyword).toBe(mockFormValue.fuzzy_keyword);
    expect(result.current.tags).toBe('table,security,offline,dcl, high');
  });

  it('render no other form', () => {
    const mockFormValue: RuleFilterFieldsType = {
      fuzzy_keyword: 'test',
      operand: 'a',
      audit_purpose: 'b',
      audit_accuracy: 'c',
      sql: 'd',
      performance_cost: 'e'
    };
    jest.spyOn(Form, 'useWatch').mockImplementation((key: NamePath) => {
      return mockFormValue[key as keyof RuleFilterFieldsType];
    });
    const { result: formResult } = renderHook(() => {
      return Form.useForm();
    });
    const { result } = renderHook(() =>
      useRuleFilterForm(formResult.current[0])
    );
    expect(result.current.fuzzyKeyword).toBe(mockFormValue.fuzzy_keyword);
    expect(result.current.tags).toBe('a,b,c,d,e');
  });
});
