import { cleanup, fireEvent, screen } from '@testing-library/react';
import SqlAudit from '..';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  getAllBySelector,
  getBySelector,
  mockUsePermission
} from '@actiontech/shared/lib/testUtil';
import eventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

describe('sqle/SqlAudit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(true),
        checkPagePermission: jest.fn().mockReturnValue(true)
      },
      {
        mockCurrentProject: true,
        mockCurrentUser: true,
        useSpyOnMockHooks: true
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = superRender(<SqlAudit />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建SQL审核')).toBeInTheDocument();
    expect(screen.getByText('创建SQL调优')).toBeInTheDocument();
  });

  it('should switch segment tab and refresh list', async () => {
    const spy = jest.spyOn(eventEmitter, 'emit');
    superRender(<SqlAudit />);
    const allTabs = getAllBySelector('.ant-segmented-item-input');
    const refreshButton = getBySelector('.ant-btn-icon-only');
    expect(allTabs[0]).toBeChecked();
    fireEvent.click(refreshButton);
    expect(spy).toHaveBeenCalledWith(EmitterKey.Refresh_Sql_Audit_List);

    fireEvent.click(screen.getByText('SQL调优'));
    expect(allTabs[1]).toBeChecked();
    fireEvent.click(refreshButton);
    expect(spy).toHaveBeenCalledWith(EmitterKey.Refresh_Sql_Optimization_List);
  });

  it('should swicth optimization tab when url params is exist', async () => {
    superRender(<SqlAudit />, undefined, {
      routerProps: {
        initialEntries: ['/sqle/sql-audit?active=sql_optimization']
      }
    });
    const allTabs = getAllBySelector('.ant-segmented-item-input');
    expect(allTabs[1]).toBeChecked();
  });
});
