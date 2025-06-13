import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, screen } from '@testing-library/react';
import MemberGroupPermissions from '../MemberGroupPermissions';
import { IListMemberRoleWithOpRange } from '@actiontech/shared/lib/api/base/service/common';

describe('base/Member/components/MemberGroupPermissions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const mockRoles: IListMemberRoleWithOpRange[] = [
    {
      role_uid: { uid: '1', name: '管理员' },
      range_uids: [
        { uid: '1', name: '数据源1' },
        { uid: '2', name: '数据源2' }
      ]
    },
    {
      role_uid: { uid: '2', name: '开发者' },
      range_uids: [{ uid: '3', name: '数据源3' }]
    }
  ];

  it('should render with ellipsis enabled', () => {
    const { baseElement } = superRender(
      <MemberGroupPermissions roles={mockRoles} ellipsis={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理员: [ 数据源1,数据源2 ]')).toBeInTheDocument();
    expect(screen.getByText('开发者: [ 数据源3 ]')).toBeInTheDocument();
  });

  it('should render with ellipsis disabled', () => {
    const { baseElement } = superRender(
      <MemberGroupPermissions roles={mockRoles} ellipsis={false} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理员: [ 数据源1,数据源2 ]')).toBeInTheDocument();
    expect(screen.getByText('开发者: [ 数据源3 ]')).toBeInTheDocument();
  });

  it('should render empty roles array', () => {
    const { baseElement } = superRender(
      <MemberGroupPermissions roles={[]} ellipsis={true} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should handle roles with undefined role_uid', () => {
    const rolesWithUndefinedRole = [
      {
        role_uid: undefined,
        range_uids: [{ uid: '1', name: '数据源1' }]
      }
    ] as IListMemberRoleWithOpRange[];

    const { baseElement } = superRender(
      <MemberGroupPermissions roles={rolesWithUndefinedRole} ellipsis={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(': [ 数据源1 ]')).toBeInTheDocument();
  });

  it('should handle roles with undefined range_uids', () => {
    const rolesWithUndefinedRange = [
      {
        role_uid: { uid: '1', name: '管理员' },
        range_uids: undefined
      }
    ] as IListMemberRoleWithOpRange[];

    const { baseElement } = superRender(
      <MemberGroupPermissions roles={rolesWithUndefinedRange} ellipsis={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理员: [  ]')).toBeInTheDocument();
  });

  it('should handle roles with empty range_uids', () => {
    const rolesWithEmptyRange = [
      {
        role_uid: { uid: '1', name: '管理员' },
        range_uids: []
      }
    ];

    const { baseElement } = superRender(
      <MemberGroupPermissions roles={rolesWithEmptyRange} ellipsis={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理员: [  ]')).toBeInTheDocument();
  });

  it('should handle roles with null role name', () => {
    const rolesWithNullName = [
      {
        role_uid: { uid: '1', name: null as any },
        range_uids: [{ uid: '1', name: '数据源1' }]
      }
    ];

    const { baseElement } = superRender(
      <MemberGroupPermissions roles={rolesWithNullName} ellipsis={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(': [ 数据源1 ]')).toBeInTheDocument();
  });

  it('should format content correctly with multiple ranges', () => {
    const roleWithManyRanges = [
      {
        role_uid: { uid: '1', name: '超级管理员' },
        range_uids: [
          { uid: '1', name: 'MySQL-1' },
          { uid: '2', name: 'PostgreSQL-1' },
          { uid: '3', name: 'Oracle-1' }
        ]
      }
    ];

    const { baseElement } = superRender(
      <MemberGroupPermissions roles={roleWithManyRanges} ellipsis={false} />
    );
    expect(
      screen.getByText('超级管理员: [ MySQL-1,PostgreSQL-1,Oracle-1 ]')
    ).toBeInTheDocument();
  });

  it('should render unique keys for roles with same uid', () => {
    const duplicateRoles = [
      {
        role_uid: { uid: '1', name: '管理员' },
        range_uids: [{ uid: '1', name: '数据源1' }]
      },
      {
        role_uid: { uid: '1', name: '管理员' },
        range_uids: [{ uid: '2', name: '数据源2' }]
      }
    ];

    const { baseElement } = superRender(
      <MemberGroupPermissions roles={duplicateRoles} ellipsis={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('管理员: [ 数据源1 ]')).toHaveLength(1);
    expect(screen.getAllByText('管理员: [ 数据源2 ]')).toHaveLength(1);
  });
});
