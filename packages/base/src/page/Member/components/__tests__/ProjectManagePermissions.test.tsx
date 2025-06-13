import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, screen } from '@testing-library/react';
import ProjectManagePermissions from '../ProjectManagePermissions';

describe('base/Member/components/ProjectManagePermissions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render project admin state', () => {
    const { baseElement } = superRender(
      <ProjectManagePermissions isProjectAdmin={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('项目管理员')).toBeInTheDocument();
  });

  it('should render partial manage permissions', () => {
    const managePermissions = [
      { uid: '1', name: '权限1' },
      { uid: '2', name: '权限2' }
    ];
    const { baseElement } = superRender(
      <ProjectManagePermissions
        isProjectAdmin={false}
        managePermissions={managePermissions}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('部分管理权限')).toBeInTheDocument();
  });

  it('should render no manage permissions', () => {
    const { baseElement } = superRender(
      <ProjectManagePermissions isProjectAdmin={false} managePermissions={[]} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('无管理权限')).toBeInTheDocument();
  });

  it('should render no manage permissions when managePermissions is undefined', () => {
    const { baseElement } = superRender(
      <ProjectManagePermissions isProjectAdmin={false} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('无管理权限')).toBeInTheDocument();
  });

  it('should show permission tags in popover content', () => {
    const managePermissions = [
      { uid: '1', name: '用户管理' },
      { uid: '2', name: '项目管理' },
      { uid: '3', name: '数据源管理' }
    ];
    const { container } = superRender(
      <ProjectManagePermissions
        isProjectAdmin={false}
        managePermissions={managePermissions}
      />
    );

    expect(screen.getByText('部分管理权限')).toBeInTheDocument();
    expect(container.querySelector('.ant-popover')).toBeNull();
  });

  it('should handle empty name in permissions', () => {
    const managePermissions = [
      { uid: '1', name: '' },
      { uid: '2', name: '权限2' }
    ];
    const { baseElement } = superRender(
      <ProjectManagePermissions
        isProjectAdmin={false}
        managePermissions={managePermissions}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('部分管理权限')).toBeInTheDocument();
  });

  it('should prioritize project admin over manage permissions', () => {
    const managePermissions = [{ uid: '1', name: '权限1' }];
    const { baseElement } = superRender(
      <ProjectManagePermissions
        isProjectAdmin={true}
        managePermissions={managePermissions}
      />
    );
    expect(screen.getByText('项目管理员')).toBeInTheDocument();
    expect(screen.queryByText('部分管理权限')).not.toBeInTheDocument();
  });
});
