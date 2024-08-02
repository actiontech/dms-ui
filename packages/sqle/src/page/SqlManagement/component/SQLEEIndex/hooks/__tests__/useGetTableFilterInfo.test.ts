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

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('SqlManagement/useGetTableFilterInfo', () => {
  beforeEach(() => {
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

  it('send request and render select options', async () => {
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
    ).toBe(0);
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

    expect(
      (
        result.current.filterCustomProps.get(
          'filter_rule_name'
        ) as CustomSelectProps
      )?.options?.length
    ).toBe(3);
    expect(
      (
        result.current.filterCustomProps.get(
          'filter_rule_name'
        ) as CustomSelectProps
      )?.loading
    ).toBe(false);
  });
});
