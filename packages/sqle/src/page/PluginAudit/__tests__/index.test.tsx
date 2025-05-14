import { act, cleanup } from '@testing-library/react';
import PluginAudit from '..';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from '../../../hooks/useDatabaseType/index.test.data';
import sqlDEVRecord from '../../../testUtils/mockApi/sqlDEVRecord';
import { ModalName } from '../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/PluginAudit', () => {
  const mockDispatch = jest.fn();
  let getSqlDEVRecordListSpy: jest.SpyInstance;

  beforeEach(() => {
    sqlDEVRecord.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta },
        pluginAudit: {
          modalStatus: {}
        },
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      });
    });
    getSqlDEVRecordListSpy = sqlDEVRecord.getSqlDEVRecordList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render table data', async () => {
    const { baseElement } = sqleSuperRender(<PluginAudit />);
    expect(getSqlDEVRecordListSpy).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
