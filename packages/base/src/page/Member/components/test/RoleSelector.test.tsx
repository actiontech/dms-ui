import userCenter from '../../../../testUtils/mockApi/userCenter';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import dbServices from '../../../../testUtils/mockApi/dbServices';
import RoleSelector from '../RoleSelector';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { Form } from 'antd';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('base/Member/Modal/AddMemberGroup', () => {
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseDbServiceDriver();
    jest.useFakeTimers();
    litDBServices = dbServices.ListDBServices();
    listRoleSpy = userCenter.getRoleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = renderWithReduxAndTheme(
      <Form>
        <RoleSelector projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(litDBServices).toBeCalledTimes(1);
    expect(listRoleSpy).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('should add fields when click add button', async () => {
    const { baseElement } = renderWithReduxAndTheme(
      <Form>
        <RoleSelector projectID={mockProjectInfo.projectID} />
      </Form>
    );
    fireEvent.click(queryBySelector('.member-form-add-button', baseElement)!);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('平台角色')).toBeInTheDocument();
    expect(screen.getByText('操作范围')).toBeInTheDocument();
    fireEvent.click(
      queryBySelector('.ant-btn-icon-only.basic-button-wrapper', baseElement)!
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('平台角色')).not.toBeInTheDocument();
    expect(screen.queryByText('操作范围')).not.toBeInTheDocument();
  });
});
