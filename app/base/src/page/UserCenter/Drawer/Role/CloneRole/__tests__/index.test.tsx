import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../../data/ModalName';
import CloneRole from '..';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('base/UserCenter/Drawer/Role/CloneRole', () => {
  let addRoleSpy: jest.SpyInstance;
  let opPermissionListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    addRoleSpy = userCenter.addRole();

    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    opPermissionListSpy = userCenter.getOpPermissionsList();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userCenter: {
          modalStatus: { [ModalName.DMS_Clone_Role]: true },
          selectRole: {
            name: 'original_role',
            desc: 'original role description',
            uid: '1001',
            op_permissions: [
              {
                name: '创建项目',
                uid: '700001'
              },
              {
                name: '修改项目',
                uid: '20150'
              }
            ]
          }
        }
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should send clone role request when click submit button', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = superRender(<CloneRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(opPermissionListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('克隆角色')).toBeInTheDocument();

    expect(screen.getByLabelText('角色名')).toHaveValue('original_role');
    expect(
      screen.getByText('当前基于"original_role"角色进行克隆，请修改角色名称')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('描述')).toHaveValue(
      'original role description'
    );

    expect(screen.getByDisplayValue('700001')).toBeChecked();
    expect(screen.getByDisplayValue('20150')).toBeChecked();

    fireEvent.input(screen.getByLabelText('角色名'), {
      target: { value: 'cloned_test_role' }
    });

    fireEvent.input(screen.getByLabelText('描述'), {
      target: { value: 'cloned role description' }
    });

    fireEvent.click(screen.getByDisplayValue('20150'));
    expect(screen.getByDisplayValue('20150')).not.toBeChecked();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');
    expect(addRoleSpy).toHaveBeenCalledTimes(1);
    expect(addRoleSpy).toHaveBeenCalledWith({
      role: {
        name: 'cloned_test_role',
        desc: 'cloned role description',
        op_permission_uids: ['700001']
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`克隆角色 "cloned_test_role" 成功`));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Clone_Role,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Refresh_User_Center_List
    );
    expect(screen.getByText('提 交').parentNode).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').parentNode).not.toHaveAttribute(
      'disabled'
    );
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = superRender(<CloneRole />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Clone_Role,
        status: false
      }
    });
  });

  it('should pre-fill form with original role data when modal opens', async () => {
    superRender(<CloneRole />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('角色名')).toHaveValue('original_role');
    expect(screen.getByLabelText('描述')).toHaveValue(
      'original role description'
    );

    expect(screen.getByDisplayValue('700001')).toBeChecked();
    expect(screen.getByDisplayValue('20150')).toBeChecked();
  });

  it('should handle empty description when cloning role', async () => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        userCenter: {
          modalStatus: { [ModalName.DMS_Clone_Role]: true },
          selectRole: {
            name: 'original_role',
            desc: null,
            uid: '1001',
            op_permissions: [
              {
                name: '创建项目',
                uid: '700001'
              }
            ]
          }
        }
      })
    );

    superRender(<CloneRole />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByLabelText('角色名')).toHaveValue('original_role');
    expect(screen.getByLabelText('描述')).toHaveValue('');

    expect(screen.getByDisplayValue('700001')).toBeChecked();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(addRoleSpy).toHaveBeenCalledWith({
      role: {
        name: 'original_role',
        desc: '',
        op_permission_uids: ['700001']
      }
    });
  });

  it('should handle permission selection and deselection', async () => {
    superRender(<CloneRole />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByDisplayValue('700001')).toBeChecked();
    expect(screen.getByDisplayValue('20150')).toBeChecked();

    fireEvent.click(screen.getByDisplayValue('700001'));
    fireEvent.click(screen.getByDisplayValue('20150'));

    expect(screen.getByDisplayValue('700001')).not.toBeChecked();
    expect(screen.getByDisplayValue('20150')).not.toBeChecked();

    fireEvent.click(screen.getByDisplayValue('700001'));
    expect(screen.getByDisplayValue('700001')).toBeChecked();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(addRoleSpy).toHaveBeenCalledWith({
      role: {
        name: 'original_role',
        desc: 'original role description',
        op_permission_uids: ['700001']
      }
    });
  });

  it('should reset form when modal closes', async () => {
    superRender(<CloneRole />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('角色名'), {
      target: { value: 'modified_name' }
    });

    expect(screen.getByLabelText('角色名')).toHaveValue('modified_name');

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'userCenter/updateModalStatus',
      payload: {
        modalName: ModalName.DMS_Clone_Role,
        status: false
      }
    });
  });
});
