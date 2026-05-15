import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import UpdateWhitelist from '../UpdateWhitelist';
import auditWhiteList from '@actiontech/shared/lib/testUtil/mockApi/sqle/auditWhiteList';
import { auditWhiteListMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/auditWhiteList/data';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('slqe/Whitelist/UpdateWhitelist', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  const dispatchSpy = jest.fn();
  let updateWhitelistSpy: jest.SpyInstance;
  const mockSelectWhitelist = auditWhiteListMockData[0];
  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: {
          modalStatus: { [ModalName.Update_Whitelist]: true },
          selectWhitelist: mockSelectWhitelist
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    updateWhitelistSpy = auditWhiteList.updateAuthWhitelist();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should send update whitelist request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = superRender(<UpdateWhitelist />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByLabelText('字符串匹配')).toBeChecked();
    expect(screen.getByLabelText('描述')).toHaveValue(mockSelectWhitelist.desc);
    expect(screen.getByLabelText('SQL语句')).toHaveValue(
      mockSelectWhitelist.value
    );
    fireEvent.click(screen.getByText('SQL指纹匹配'));
    fireEvent.input(screen.getByLabelText('描述'), {
      target: { value: 'test desc' }
    });
    fireEvent.input(screen.getByLabelText('SQL语句'), {
      target: { value: 'SELECT 1;' }
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(updateWhitelistSpy).toHaveBeenCalledTimes(1);
    expect(updateWhitelistSpy).toHaveBeenCalledWith({
      value: 'SELECT 1;',
      desc: 'test desc',
      match_type: CreateAuditWhitelistReqV1MatchTypeEnum.fp_match,
      project_name: mockProjectInfo.projectName,
      audit_whitelist_id: `${mockSelectWhitelist.audit_whitelist_id}`
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Whitelist,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Whitelist_List
    );
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = superRender(<UpdateWhitelist />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Whitelist,
        status: false
      }
    });
  });
});
