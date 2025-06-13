import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import PermissionFields from '../PermissionFields';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { Form } from 'antd';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('base/Member/components/PermissionFields', () => {
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  let opPermissionListSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseDbServiceDriver();
    jest.useFakeTimers();
    litDBServices = dbServices.ListDBServicesTips();
    listRoleSpy = userCenter.getRoleList();
    opPermissionListSpy = userCenter.getOpPermissionsList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render with default state', async () => {
    const { baseElement } = superRender(
      <Form>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(litDBServices).toHaveBeenCalledTimes(1);
    expect(listRoleSpy).toHaveBeenCalledTimes(1);
    expect(opPermissionListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理员设置')).toBeInTheDocument();
    expect(screen.getByText('是否是项目管理员')).toBeInTheDocument();
  });

  it('should show admin tips when project admin is enabled', async () => {
    const { baseElement } = superRender(
      <Form initialValues={{ isProjectAdmin: true }}>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('项目管理员拥有项目的全部权限')
    ).toBeInTheDocument();
    expect(screen.queryByText('项目管理权限')).not.toBeInTheDocument();
    expect(screen.queryByText('项目操作权限')).not.toBeInTheDocument();
  });

  it('should show permission fields when project admin is disabled', async () => {
    const { baseElement } = superRender(
      <Form initialValues={{ isProjectAdmin: false }}>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('项目管理权限')).toBeInTheDocument();
    expect(screen.getByText('项目操作权限')).toBeInTheDocument();
    expect(
      screen.queryByText('项目管理员拥有项目的全部权限')
    ).not.toBeInTheDocument();
  });

  it('should add and remove role fields', async () => {
    const { baseElement } = superRender(
      <Form initialValues={{ isProjectAdmin: false }}>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('操作范围')).not.toBeInTheDocument();
    expect(screen.queryByText('平台角色')).not.toBeInTheDocument();

    fireEvent.click(queryBySelector('.member-form-add-button', baseElement)!);
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('操作范围')).toBeInTheDocument();
    expect(screen.getByText('平台角色')).toBeInTheDocument();

    fireEvent.click(
      queryBySelector('.ant-btn-icon-only.basic-button-wrapper', baseElement)!
    );
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.queryByText('操作范围')).not.toBeInTheDocument();
    expect(screen.queryByText('平台角色')).not.toBeInTheDocument();
  });

  it('should add multiple role fields', async () => {
    const { baseElement } = superRender(
      <Form initialValues={{ isProjectAdmin: false }}>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));

    const addButton = queryBySelector('.member-form-add-button', baseElement)!;

    fireEvent.click(addButton);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(addButton);
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getAllByText('操作范围')).toHaveLength(1);
    expect(screen.getAllByText('平台角色')).toHaveLength(1);
    expect(
      queryBySelector('.ant-btn-icon-only.basic-button-wrapper', baseElement)
    ).toBeInTheDocument();
  });

  it('should toggle between admin and non-admin modes', async () => {
    const TestForm = () => {
      const [form] = Form.useForm();
      return (
        <Form form={form} initialValues={{ isProjectAdmin: false }}>
          <PermissionFields projectID={mockProjectInfo.projectID} />
        </Form>
      );
    };

    const { baseElement } = superRender(<TestForm />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('项目管理权限')).toBeInTheDocument();

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    await act(async () => jest.advanceTimersByTime(300));

    expect(
      screen.getByText('项目管理员拥有项目的全部权限')
    ).toBeInTheDocument();
    expect(screen.queryByText('项目管理权限')).not.toBeInTheDocument();
  });

  it('should show loading state', async () => {
    const { baseElement } = superRender(
      <Form initialValues={{ isProjectAdmin: false }}>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });

  it('should handle permission checkboxes', async () => {
    const { baseElement } = superRender(
      <Form initialValues={{ isProjectAdmin: false }}>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(1);

    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
  });
});
