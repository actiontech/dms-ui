import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import CBSqlOperationAuditDetailDrawer from '../CBSqlOperationAuditDetailDrawer';
import { superRender } from '../../../../testUtils/customRender';
import { useDispatch, useSelector } from 'react-redux';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../data/ModalName';
import rule_template from 'sqle/src/testUtils/mockApi/rule_template/index';
import { listCBOperationLogsMockData } from '../../../../testUtils/mockApi/cloudBeaver/data';

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

  it('should match snap shot', async () => {
    const { baseElement } = superRender(<CBSqlOperationAuditDetailDrawer />);
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
    superRender(<CBSqlOperationAuditDetailDrawer />);
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
