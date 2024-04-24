import { act, cleanup } from '@testing-library/react';
import SqlOptimization from '.';
import { superRender } from '../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import sqlOptimization from '../../testUtils/mockApi/sqlOptimization';
import { useNavigate } from 'react-router-dom';

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
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render table data', async () => {
    const { baseElement } = superRender(<SqlOptimization />);
    expect(getOptimizationRecordsSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
