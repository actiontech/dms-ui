import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import CBSqlOperationAuditDetailDrawer from './CBSqlOperationAuditDetailDrawer';
import { baseSuperRender } from '../../../testUtils/superRender';
import { useDispatch, useSelector } from 'react-redux';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../data/ModalName';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/index';
import { listCBOperationLogsMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/cloudBeaver/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
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

describe('base/CloudBeaver/CBSqlOperationAuditDetailDrawer', () => {
  const mockDispatch = jest.fn();
  let getRuleListSpy: jest.SpyInstance;

  beforeEach(() => {
    getRuleListSpy = rule_template.getRuleList();
    mockUseCurrentUser();
    mockUseCurrentProject();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        cloudBeaver: {
          modalStatus: {
            [ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail]: true
          },
          cloudBeaverSqlOperationRecord: listCBOperationLogsMockData[1]
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
    const { baseElement } = baseSuperRender(
      <CBSqlOperationAuditDetailDrawer />
    );
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cloudBeaver/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail]: false
        }
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRuleListSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL审核结果')).toBeInTheDocument();
    expect(screen.getByText('审核结果')).toBeInTheDocument();
    expect(screen.getByText('SQL语句')).toBeInTheDocument();
  });

  it('close modal', async () => {
    baseSuperRender(<CBSqlOperationAuditDetailDrawer />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.closed-icon-custom'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cloudBeaver/updateModalStatus',
      payload: {
        modalName: ModalName.Cloud_Beaver_Sql_Operation_Audit_Detail,
        status: false
      }
    });
  });
});
