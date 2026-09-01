import useGetTableFilterInfo from '../useGetTableFilterInfo';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import sqlManage from '../../../../../../testUtils/mockApi/sqlManage';
import { act, cleanup } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import instance from '../../../../../../testUtils/mockApi/instance';
import { CustomSelectProps } from '@actiontech/shared/lib/components/CustomSelect';
import { renderHooksWithRedux } from '../../../../../../testUtils/customRender';
import { useSelector } from 'react-redux';
import { mockUseAuditPlanTypes } from '../../../../../../testUtils/mockRequest';
import {
  DB_TYPE_RULE_NAME_SEPARATOR,
  resetRuleTipsCacheForTests
} from '../../../../../../hooks/useRuleTips';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('SqlManagement/useGetTableFilterInfo', () => {
  beforeEach(() => {
    resetRuleTipsCacheForTests();
    mockUseCurrentProject();
    instance.mockAllApi();
    sqlManage.mockAllApi();
    jest.useFakeTimers();
    mockUseAuditPlanTypes();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: [] }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('send request and show all rule options before db type selected', async () => {
    const ruleTipsRequest = sqlManage.getSqlManageRuleTips();
    const instanceRequest = instance.getInstanceTipList();
    const { result } = renderHooksWithRedux(() => useGetTableFilterInfo());
    expect(ruleTipsRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(instanceRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(
      (
        result.current.filterCustomProps.get(
          'filter_instance_id'
        ) as CustomSelectProps
      )?.options?.length
    ).toBe(0);
    expect(
      (
        result.current.filterCustomProps.get(
          'filter_instance_id'
        ) as CustomSelectProps
      )?.loading
    ).toBe(true);
    expect(
      (
        result.current.filterCustomProps.get(
          'filter_rule_name'
        ) as CustomSelectProps
      )?.options?.length
    ).toBe(1);
    expect(
      (
        result.current.filterCustomProps.get(
          'filter_rule_name'
        ) as CustomSelectProps
      )?.options?.[0]
    ).toEqual(
      expect.objectContaining({
        value: '__PARSE_FAILED__'
      })
    );
    expect(
      (
        result.current.filterCustomProps.get(
          'filter_rule_name'
        ) as CustomSelectProps
      )?.loading
    ).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      (
        result.current.filterCustomProps.get(
          'filter_source'
        ) as CustomSelectProps
      )?.options?.length
    ).toBe(5);
    expect(
      (
        result.current.filterCustomProps.get(
          'filter_instance_id'
        ) as CustomSelectProps
      )?.options?.length
    ).toBe(2);
    expect(
      (
        result.current.filterCustomProps.get(
          'filter_instance_id'
        ) as CustomSelectProps
      )?.loading
    ).toBe(false);

    const ruleFilterProps = result.current.filterCustomProps.get(
      'filter_rule_name'
    ) as CustomSelectProps;
    expect(ruleFilterProps?.options?.length).toBeGreaterThan(0);
    expect(ruleFilterProps?.loading).toBe(false);
    expect(ruleFilterProps?.notFoundContent).toBeUndefined();
    expect(ruleFilterProps?.dropdownRender).toBeDefined();
  });

  it('shows flat rule options after db type is known from filter value', async () => {
    const { result } = renderHooksWithRedux(() =>
      useGetTableFilterInfo({
        filterRuleName: `MySQL${DB_TYPE_RULE_NAME_SEPARATOR}test`
      })
    );
    await act(async () => jest.advanceTimersByTime(3000));

    const ruleFilterProps = result.current.filterCustomProps.get(
      'filter_rule_name'
    ) as CustomSelectProps;
    expect(ruleFilterProps?.options?.length).toBe(2);
    expect(ruleFilterProps?.options?.[0]).toEqual(
      expect.objectContaining({
        value: '__PARSE_FAILED__'
      })
    );
    expect(ruleFilterProps?.options?.[1]).toEqual(
      expect.objectContaining({
        text: expect.stringContaining('用于测试'),
        value: `MySQL${DB_TYPE_RULE_NAME_SEPARATOR}test`
      })
    );
    expect(ruleFilterProps?.options?.[1]?.label).toBeDefined();
  });
});
