import { act, cleanup } from '@testing-library/react';
import SqlOptimization from '.';
import { superRender } from '../../testUtils/customRender';
import sqlOptimization from '../../testUtils/mockApi/sqlOptimization';
import { useNavigate } from 'react-router-dom';
import { mockUseSystemModuleStatus } from '@actiontech/shared/lib/testUtil/mockHook/mockUseSystemModuleStatus';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/SqlOptimization', () => {
  let getOptimizationRecordsSpy: jest.SpyInstance;
  const navigateSpy = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    getOptimizationRecordsSpy = sqlOptimization.getOptimizationRecords();
    mockUseSystemModuleStatus();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should navigate to index when sql optimization is not supported', async () => {
    superRender(<SqlOptimization />);
    expect(getOptimizationRecordsSpy).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('render table data', async () => {
    mockUseSystemModuleStatus({
      sqlOptimizationIsSupported: true
    });
    const { baseElement } = superRender(<SqlOptimization />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
