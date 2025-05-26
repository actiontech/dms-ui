import {
  IListDBRoleTips,
  IListDBRole,
  IDBRoleDetail
} from '../../../../api/provision/service/common';

export const mockDBRoleTips: IListDBRoleTips[] = [
  {
    db_role: {
      name: 'role1',
      uid: '123'
    }
  },
  {
    db_role: {
      name: 'role2',
      uid: '1234'
    }
  },
  {
    db_role: {
      name: 'role3',
      uid: '12345'
    }
  }
];

export const mockDBRoleData: IListDBRole[] = [
  {
    db_role: {
      name: 'role1',
      uid: '123'
    },
    data_permissions: ['ALTER', 'CREATE', 'SELECT'],
    create_user: {
      name: 'user1',
      uid: '123'
    },
    child_roles: [
      {
        name: 'role1_child_1',
        uid: 'c123'
      },
      {
        name: 'role1_child_2',
        uid: 'c1234'
      }
    ]
  },
  {
    db_role: {
      name: 'role2',
      uid: '1234'
    },
    data_permissions: ['ALTER', 'CREATE', 'SELECT'],
    create_user: {
      name: 'user2',
      uid: '1234'
    },
    child_roles: [
      {
        name: 'role2_child_1',
        uid: 'c1232'
      },
      {
        name: 'role2_child_2',
        uid: 'c12342'
      }
    ]
  },
  {
    db_role: undefined
  }
];

export const mockRoleDetailMockData: IDBRoleDetail = {
  db_role: {
    name: 'role1',
    uid: '123'
  },
  child_roles: [
    {
      name: 'role1_child_1',
      uid: 'c123'
    },
    {
      name: 'role1_child_2',
      uid: 'c1234'
    }
  ],
  data_permissions: [
    {
      data_objects: [
        {
          table_uid: '1',
          database_uid: '1',
          name: 'database-1.table-1'
        }
      ],
      data_operations: [
        {
          uid: '600010',
          name: 'ALL'
        }
      ]
    },
    {
      data_operations: [
        {
          uid: '600033',
          name: 'CREATE_USER'
        }
      ]
    }
  ]
};
