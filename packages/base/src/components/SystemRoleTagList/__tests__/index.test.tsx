import { screen } from '@testing-library/react';
import SystemRoleTagList from '..';
import { OpPermissionTypeUid } from '@actiontech/dms-kit';
import { superRender } from '@actiontech/shared/lib/testUtil';

describe('PermissionTagList', () => {
  it('should render "-" when no permissions provided', () => {
    superRender(<SystemRoleTagList />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render "-" when empty permissions array provided', () => {
    superRender(<SystemRoleTagList roles={[]} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should render permission tags with correct colors', () => {
    const roles = [
      {
        uid: OpPermissionTypeUid.project_director,
        name: '项目总监'
      },
      {
        uid: OpPermissionTypeUid.audit_administrator,
        name: '审计管理员'
      },
      {
        uid: OpPermissionTypeUid.system_administrator,
        name: '系统管理员'
      },
      {
        uid: OpPermissionTypeUid.create_workflow,
        name: '创建工单'
      }
    ];

    superRender(<SystemRoleTagList roles={roles} />);

    expect(screen.getByText('项目总监')).toBeInTheDocument();
    expect(screen.getByText('审计管理员')).toBeInTheDocument();
    expect(screen.getByText('系统管理员')).toBeInTheDocument();
    expect(screen.getByText('创建工单')).toBeInTheDocument();
  });
});
