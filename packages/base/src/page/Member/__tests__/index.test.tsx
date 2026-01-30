import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import Member from '..';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import member from '@actiontech/shared/lib/testUtil/mockApi/base/member';
import { memberList } from '@actiontech/shared/lib/testUtil/mockApi/base/member/data';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('base/Member', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    member.mockAllApi();
    mockUseCurrentProject();
    userCenter.getUserList();
    dbServices.ListDBServicesTips();
    userCenter.getRoleList();
    userCenter.getOpPermissionsList();

    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUsePermission(
      {
        checkActionPermission: jest.fn().mockReturnValue(true)
      },
      {
        useSpyOnMockHooks: true
      }
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should render member list when it first entered the member page', async () => {
    const memberListSpy = member.getMemberList();
    const { baseElement } = superRender(<Member />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(memberListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(`共 ${memberList.length} 条数据`)
    ).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(
      getBySelector('.ant-segmented-group', baseElement)
    ).toBeInTheDocument();
  });

  it('should receive "DMS_Refresh_Member_List" event when click refresh icon', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const memberListSpy = member.getMemberList();
    const { baseElement } = superRender(<Member />);
    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(memberListSpy).toHaveBeenCalledTimes(2);
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_Member_List
    );
  });

  it('should update content when change segmented value', async () => {
    const memberGroupListSpy = member.getMemberGroupList();
    const { baseElement } = superRender(<Member />);
    fireEvent.click(screen.getByText('成员组列表'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('.ant-segmented-item-selected')).toHaveTextContent(
      '成员组列表'
    );
    expect(baseElement).toMatchSnapshot();
    expect(memberGroupListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('添加成员组')).toBeInTheDocument();
    fireEvent.click(screen.getByText('添加成员组'));
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Member_Group,
        status: true
      }
    });
  });

  it('should render add button when current user is admin or project manager', async () => {
    superRender(<Member />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryAllByText('添加成员')).toHaveLength(1);
    fireEvent.click(screen.getByText('添加成员'));
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(screen.queryAllByText('添加成员')).toHaveLength(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Add_Member,
        status: true
      }
    });
  });
});
