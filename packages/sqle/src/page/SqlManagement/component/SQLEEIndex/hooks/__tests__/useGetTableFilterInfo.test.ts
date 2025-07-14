import useGetTableFilterInfo from '../useGetTableFilterInfo';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import sqlManage from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlManage';
import { act, cleanup } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import { CustomSelectProps } from '@actiontech/shared/lib/components/CustomSelect';
import { sqleSuperRenderHook } from '../../../../../../testUtils/superRender';
import { useSelector } from 'react-redux';
import { mockUseAuditPlanTypes } from '../../../../../../testUtils/mockRequest';
import { useSearchParams } from 'react-router-dom';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn()
  };
});

describe('SqlManagement/useGetTableFilterInfo', () => {
  const useSearchParamsSpy: jest.Mock = useSearchParams as jest.Mock;
  let listEnvironmentTagsSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentProject();
    instance.mockAllApi();
    sqlManage.mockAllApi();
    listEnvironmentTagsSpy = project.listEnvironmentTags();
    jest.useFakeTimers();
    mockUseAuditPlanTypes();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: [] }
      });
    });
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        instanceId: '',
        source: ''
      })
    ]);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('send request and render select options', async () => {
    const ruleTipsRequest = sqlManage.getSqlManageRuleTips();
    const instanceRequest = instance.getInstanceTipList();
    const { result } = sqleSuperRenderHook(() => useGetTableFilterInfo());
    expect(ruleTipsRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(instanceRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
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
