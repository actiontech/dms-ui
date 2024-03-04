import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import AddWhitelist from '../AddWhitelist';
import auditWhiteList from '../../../../testUtils/mockApi/auditWhiteList';
import { CreateAuditWhitelistReqV1MatchTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('slqe/Whitelist/AddWhitelist', () => {
  const dispatchSpy = jest.fn();
  let addWhitelistSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: true } }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    addWhitelistSpy = auditWhiteList.addAuthWhitelist();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should send add whitelist request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(<AddWhitelist />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('SQL指纹匹配'));
    fireEvent.input(screen.getByLabelText('白名单描述'), {
      target: { value: 'test desc' }
    });
    fireEvent.input(screen.getByLabelText('SQL语句'), {
      target: { value: 'SELECT 1;' }
    });
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(addWhitelistSpy).toHaveBeenCalledTimes(1);
    expect(addWhitelistSpy).toHaveBeenCalledWith({
      value: 'SELECT 1;',
      desc: 'test desc',
      match_type: CreateAuditWhitelistReqV1MatchTypeEnum.fp_match,
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Whitelist,
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
    const { baseElement } = renderWithReduxAndTheme(<AddWhitelist />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Whitelist,
        status: false
      }
    });
  });
});
