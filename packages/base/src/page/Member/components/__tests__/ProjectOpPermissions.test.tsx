import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, screen } from '@testing-library/react';
import ProjectPermissions from '../ProjectOpPermissions';
import { IProjectOpPermission } from '@actiontech/shared/lib/api/base/service/common';

describe('base/Member/components/ProjectPermissions', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const mockPermissions: IProjectOpPermission[] = [
    {
      data_source: 'MySQL-1',
      roles: [
        {
          uid: '1',
          name: '管理员',
          op_permissions: [
            { uid: '1', name: '读权限' },
            { uid: '2', name: '写权限' }
          ]
        },
        {
          uid: '2',
          name: '开发者',
          op_permissions: [{ uid: '1', name: '读权限' }]
        }
      ]
    },
    {
      data_source: 'PostgreSQL-1',
      roles: [
        {
          uid: '3',
          name: '测试员',
          op_permissions: [{ uid: '3', name: '查询权限' }],
          member_group: {
            uid: 'group1',
            name: '测试组'
          }
        }
      ]
    }
  ];

  it('should render permissions with multiple data sources', () => {
    const { baseElement } = superRender(
      <ProjectPermissions permissions={mockPermissions} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('MySQL-1:')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL-1:')).toBeInTheDocument();
    expect(screen.getByText('管理员')).toBeInTheDocument();
    expect(screen.getByText('开发者')).toBeInTheDocument();
    expect(screen.getByText('测试员')).toBeInTheDocument();
  });

  it('should handle permissions with empty roles', () => {
    const emptyRolesPermissions: IProjectOpPermission[] = [
      {
        data_source: 'MySQL-1',
        roles: []
      }
    ];
    const { baseElement } = superRender(
      <ProjectPermissions permissions={emptyRolesPermissions} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('MySQL-1:')).toBeInTheDocument();
  });

  it('should handle permissions with undefined data_source', () => {
    const undefinedDataSourcePermissions = [
      {
        data_source: undefined,
        roles: [
          {
            uid: '1',
            name: '管理员',
            op_permissions: [{ uid: '1', name: '读权限' }]
          }
        ]
      }
    ] as IProjectOpPermission[];

    const { baseElement } = superRender(
      <ProjectPermissions permissions={undefinedDataSourcePermissions} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(':')).toBeInTheDocument();
    expect(screen.getByText('管理员')).toBeInTheDocument();
  });

  it('should handle roles with empty name', () => {
    const emptyNameRolePermissions: IProjectOpPermission[] = [
      {
        data_source: 'MySQL-1',
        roles: [
          {
            uid: '1',
            name: '',
            op_permissions: [{ uid: '1', name: '读权限' }]
          }
        ]
      }
    ];
    const { baseElement } = superRender(
      <ProjectPermissions permissions={emptyNameRolePermissions} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('MySQL-1:')).toBeInTheDocument();
    const emptyTag = baseElement.querySelector('.ant-tag');
    expect(emptyTag).toBeInTheDocument();
  });

  it('should handle roles without member_group', () => {
    const nonMemberGroupPermissions: IProjectOpPermission[] = [
      {
        data_source: 'MySQL-1',
        roles: [
          {
            uid: '1',
            name: '管理员',
            op_permissions: [{ uid: '1', name: '读权限' }]
          }
        ]
      }
    ];
    const { baseElement } = superRender(
      <ProjectPermissions permissions={nonMemberGroupPermissions} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理员')).toBeInTheDocument();
  });

  it('should handle roles with undefined op_permissions', () => {
    const undefinedOpPermissions = [
      {
        data_source: 'MySQL-1',
        roles: [
          {
            uid: '1',
            name: '管理员',
            op_permissions: undefined
          }
        ]
      }
    ] as IProjectOpPermission[];

    const { baseElement } = superRender(
      <ProjectPermissions permissions={undefinedOpPermissions} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理员')).toBeInTheDocument();
  });

  it('should handle multiple permissions for same data source', () => {
    const multiplePermissions: IProjectOpPermission[] = [
      {
        data_source: 'MySQL-1',
        roles: [
          {
            uid: '1',
            name: '管理员',
            op_permissions: [{ uid: '1', name: '读权限' }]
          }
        ]
      },
      {
        data_source: 'MySQL-1',
        roles: [
          {
            uid: '2',
            name: '开发者',
            op_permissions: [{ uid: '2', name: '写权限' }]
          }
        ]
      }
    ];

    const { baseElement } = superRender(
      <ProjectPermissions permissions={multiplePermissions} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('MySQL-1:')).toHaveLength(2);
    expect(screen.getByText('管理员')).toBeInTheDocument();
    expect(screen.getByText('开发者')).toBeInTheDocument();
  });

  it('should render role tags with proper keys', () => {
    const duplicateRoleNames: IProjectOpPermission[] = [
      {
        data_source: 'MySQL-1',
        roles: [
          {
            uid: '1',
            name: '管理员',
            op_permissions: [{ uid: '1', name: '读权限' }]
          },
          {
            uid: '2',
            name: '管理员',
            op_permissions: [{ uid: '2', name: '写权限' }]
          }
        ]
      }
    ];

    const { baseElement } = superRender(
      <ProjectPermissions permissions={duplicateRoleNames} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('管理员')).toHaveLength(2);
  });

  it('should handle complex nested data structure', () => {
    const complexPermissions: IProjectOpPermission[] = [
      {
        data_source: 'MySQL-Cluster-1',
        roles: [
          {
            uid: '1',
            name: '超级管理员',
            op_permissions: [
              { uid: '1', name: '全部权限' },
              { uid: '2', name: '系统配置' },
              { uid: '3', name: '用户管理' }
            ],
            member_group: {
              uid: 'admin-group',
              name: '管理员组'
            }
          },
          {
            uid: '2',
            name: '只读用户',
            op_permissions: [{ uid: '4', name: '查看权限' }]
          }
        ]
      }
    ];

    const { baseElement } = superRender(
      <ProjectPermissions permissions={complexPermissions} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('MySQL-Cluster-1:')).toBeInTheDocument();
    expect(screen.getByText('超级管理员')).toBeInTheDocument();
    expect(screen.getByText('只读用户')).toBeInTheDocument();
  });
});
