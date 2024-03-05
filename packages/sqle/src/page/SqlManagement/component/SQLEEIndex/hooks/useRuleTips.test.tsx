import useRuleTips from './useRuleTips';
import sqlManage from '../../../../../testUtils/mockApi/sqlManage';
import { act, cleanup } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { ruleTipsData } from '../../../../../testUtils/mockApi/sqlManage/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useSelector } from 'react-redux';
import { renderHooksWithRedux } from '../../../../../testUtils/customRender';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('SqlManagement/useRuleTips', () => {
  beforeEach(() => {
    sqlManage.mockAllApi();
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: {
          driverMeta: []
        }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('get rule tips', async () => {
    const request = sqlManage.getSqlManageRuleTips();
    const { result } = renderHooksWithRedux(() => useRuleTips());
    await act(async () => {
      result.current.updateRuleTips(mockProjectInfo.projectName);
    });
    expect(result.current.loading).toBe(true);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.ruleTips).toStrictEqual(ruleTipsData);
    expect(result.current.generateRuleTipsSelectOptions.length).toBe(3);
    expect(result.current.generateRuleTipsSelectOptions[0].options.length).toBe(
      1
    );
    expect(
      result.current.generateRuleTipsSelectOptions[0].options[0].label
    ).toBe(ruleTipsData?.[0].rule?.[0].desc);
  });

  it('get rule tips with return error code', async () => {
    const request = sqlManage.getSqlManageRuleTips();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        code: 500,
        message: 'error'
      })
    );
    const { result } = renderHooksWithRedux(() => useRuleTips());
    await act(async () => {
      result.current.updateRuleTips(mockProjectInfo.projectName);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(result.current.ruleTips).toStrictEqual([]);
    expect(result.current.generateRuleTipsSelectOptions.length).toBe(0);
  });

  it('request rule tips failed', async () => {
    const request = sqlManage.getSqlManageRuleTips();
    request.mockImplementation(() => Promise.reject('error'));
    const { result } = renderHooksWithRedux(() => useRuleTips());
    await act(async () => {
      result.current.updateRuleTips(mockProjectInfo.projectName);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(result.current.ruleTips).toStrictEqual([]);
    expect(result.current.generateRuleTipsSelectOptions.length).toBe(0);
  });
});
