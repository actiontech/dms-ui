import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, screen } from '@testing-library/react';
import ProjectManagePermissions from '../ProjectManagePermissions';
import {
  ICurrentProjectAdmin,
  IProjectManagePermission
} from '@actiontech/shared/lib/api/base/service/common';

describe('base/Member/components/ProjectManagePermissions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render ALL when user is project admin', () => {
    const { baseElement } = superRender(
      <ProjectManagePermissions isProjectAdmin={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('ALL')).toBeInTheDocument();
  });

  it('should render ALL when currentProjectAdmin.is_admin is true', () => {
    const currentProjectAdmin: ICurrentProjectAdmin = {
      is_admin: true,
      member_groups: ['Admin Group']
    };
    const { baseElement } = superRender(
      <ProjectManagePermissions
        isProjectAdmin={false}
        currentProjectAdmin={currentProjectAdmin}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('ALL')).toBeInTheDocument();
  });

  it('should render ALL when user is project admin and currentProjectAdmin.is_admin is true', () => {
    const currentProjectAdmin: ICurrentProjectAdmin = {
      is_admin: true,
      member_groups: ['Admin Group']
    };
    const { baseElement } = superRender(
      <ProjectManagePermissions
        isProjectAdmin={true}
        currentProjectAdmin={currentProjectAdmin}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('ALL')).toBeInTheDocument();
  });

  it('should render manage permissions tags when user has partial permissions', () => {
    const managePermissions: IProjectManagePermission[] = [
      { uid: '1', name: '用户管理' },
      { uid: '2', name: '项目管理' },
      { uid: '3', name: '数据源管理' }
    ];
    const { baseElement } = superRender(
      <ProjectManagePermissions
        isProjectAdmin={false}
        managePermissions={managePermissions}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('用户管理')).toBeInTheDocument();
    expect(screen.getByText('项目管理')).toBeInTheDocument();
    expect(screen.getByText('数据源管理')).toBeInTheDocument();
  });

  it('should render dash when no permissions and not admin', () => {
    const { baseElement } = superRender(
      <ProjectManagePermissions isProjectAdmin={false} managePermissions={[]} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render dash when managePermissions is undefined', () => {
    const { baseElement } = superRender(
      <ProjectManagePermissions isProjectAdmin={false} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should handle empty name in permissions', () => {
    const managePermissions: IProjectManagePermission[] = [
      { uid: '1', name: '' },
      { uid: '2', name: '项目管理' }
    ];
    const { baseElement } = superRender(
      <ProjectManagePermissions
        isProjectAdmin={false}
        managePermissions={managePermissions}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('项目管理')).toBeInTheDocument();
  });
});
