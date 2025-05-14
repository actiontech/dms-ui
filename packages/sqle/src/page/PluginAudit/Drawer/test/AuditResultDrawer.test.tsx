import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import AuditResultDrawer from '../AuditResultDrawer';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { useDispatch, useSelector } from 'react-redux';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../data/ModalName';
import { sqlDEVRecordListMockData } from '../../../../testUtils/mockApi/sqlDEVRecord/data';
import rule_template from '../../../../testUtils/mockApi/rule_template/index';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/PluginAudit/AuditResultDrawer', () => {
  const mockDispatch = jest.fn();
  let getRuleListSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentUser();
    getRuleListSpy = rule_template.getRuleList();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        pluginAudit: {
          modalStatus: {
            [ModalName.View_Plugin_Audit_Result_Drawer]: true
          },
          pluginAuditRecord: sqlDEVRecordListMockData[1]
        }
      });
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  it('should match snap shot', async () => {
    const { baseElement } = sqleSuperRender(<AuditResultDrawer />);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pluginAudit/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.View_Plugin_Audit_Result_Drawer]: false
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleListSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('IDE审核结果')).toBeInTheDocument();
    expect(screen.getByText('审核结果')).toBeInTheDocument();
    expect(screen.getByText('SQL语句')).toBeInTheDocument();
  });

  it('close modal', async () => {
    sqleSuperRender(<AuditResultDrawer />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.closed-icon-custom'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'pluginAudit/updateModalStatus',
      payload: {
        modalName: ModalName.View_Plugin_Audit_Result_Drawer,
        status: false
      }
    });
  });
});
