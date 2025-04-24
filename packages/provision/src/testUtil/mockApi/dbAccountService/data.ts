import {
  IListDBAccount,
  IAccountStatics,
  IStatement,
  IDBAccountBody
} from '@actiontech/shared/lib/api/provision/service/common';
import {
  ListDBAccountPasswordExpirationPolicyEnum,
  ListDBAccountStatusEnum
} from '@actiontech/shared/lib/api/provision/service/common.enum';

export const dbAccountMockData: IListDBAccount[] = [
  {
    db_account_uid: '1795004057392254976',
    account_info: {
      user: 'test1',
      hostname: '%'
    },
    explanation: 'desc',
    db_service: {
      uid: '1793883708181188608',
      name: 'test1'
    },
    expired_time: '2025-08-25T17:27:05.000+08:00',
    password_expired: false,
    password_expiration_policy:
      ListDBAccountPasswordExpirationPolicyEnum.expiration_lock,
    status: ListDBAccountStatusEnum.lock,
    platform_managed: true,
    auth_users: [
      {
        uid: '1767103833235787776',
        name: 't3'
      }
    ],
    remaining_days: '89天2小时'
  },
  {
    db_account_uid: '1794998179528183808',
    account_info: {
      user: 'testa11',
      hostname: '%',
      password: ''
    },
    explanation: '',
    db_service: {
      uid: '1793905180144570368',
      name: 'test2'
    },
    expired_time: '2025-08-25T17:27:05.000+08:00',
    password_expired: false,

    password_expiration_policy:
      ListDBAccountPasswordExpirationPolicyEnum.expiration_available,
    status: ListDBAccountStatusEnum.unlock,
    platform_managed: false,
    auth_users: [],
    remaining_days: '0'
  },
  {
    db_account_uid: '1795004059191611392',
    account_info: {
      user: 'testa11'
    },
    expired_time: '2025-08-25T17:27:05.000+08:00',
    password_expired: false,

    explanation: '',
    db_service: {},
    password_expiration_policy:
      ListDBAccountPasswordExpirationPolicyEnum.expiration_lock,
    status: ListDBAccountStatusEnum.unlock,
    platform_managed: true,
    remaining_days: '29天3小时'
  },
  {
    db_account_uid: '1794998179528183811',
    account_info: {
      user: 'testa11',
      hostname: '%',
      password: ''
    },
    explanation: '',
    db_service: {
      uid: '1793905180144570368',
      name: 'test2'
    },
    expired_time: '2023-08-25T17:27:05.000+08:00',
    password_expired: true,
    password_expiration_policy:
      ListDBAccountPasswordExpirationPolicyEnum.expiration_available,
    status: ListDBAccountStatusEnum.expired,
    platform_managed: false,
    auth_users: [],
    remaining_days: '0'
  },
  {
    db_account_uid: '1794998179528183812',
    account_info: {
      user: 'testa11',
      hostname: '%',
      password: ''
    },
    explanation: '',
    db_service: {
      uid: '1793905180144570368',
      name: 'test2'
    },
    expired_time: '2023-08-25T17:27:05.000+08:00',
    password_expired: true,
    password_expiration_policy:
      ListDBAccountPasswordExpirationPolicyEnum.expiration_lock,
    status: ListDBAccountStatusEnum.expired,
    platform_managed: false,
    auth_users: [],
    remaining_days: '0'
  }
];

export const dbAccountStaticsMockData: IAccountStatics = {
  lock_account_num: 1,

  nearing_expiration_account_num: 2,

  total_account_num: 3,

  unlock_account_num: 4
};

export const statementList: IStatement[] = [
  {
    create_statement: 'CREATE USER IF NOT EXISTS admin@% IDENTIFIED BY ***',
    grant_statements: ['GRANT ALL ON sys.* TO `admin`@`%` WITH GRANT OPTION'],
    comment: '# statement belong to service: s1, address is 10.186.61.75:33061'
  },
  {
    grant_statements: [
      "GRANT ALL ON *.* TO 'super'@'localhost' WITH GRANT OPTION",
      "GRANT ALL ON *.* TO 'super'@'localhost' WITH GRANT OPTION"
    ],
    create_statement: "CREATE USER 'test1'@'localhost' IDENTIFIED BY 'test1'",
    comment: '# 用户属于10.186.61.79'
  },
  {
    grant_statements: [
      "GRANT ALL ON *.* TO 'super'@'localhost' WITH GRANT OPTION",
      "GRANT ALL ON *.* TO 'super'@'localhost' WITH GRANT OPTION"
    ],
    create_statement: "CREATE USER 'test2'@'localhost' IDENTIFIED BY 'test2'",
    comment: '# 用户属于10.186.61.80'
  }
];

export const databaseAccountDetailMockData = {
  db_account_uid: '1795004057392254976',
  account_info: {
    user: 'test1',
    hostname: '%',
    address: '127.0.0.1:3306',
    password: '123456',
    password_create_time: '2024-06-03T13:24:26.000+08:00',
    expired_time: '2024-07-03T13:24:26.000+08:00',
    connect_string: 'mysql -u test1 -h 127.0.0.1:3306 -P 3306 -p',
    explanation: '',
    additional_params: [
      {
        key: 'hostname',
        value: '%',
        desc: '主机名',
        type: ''
      }
    ]
  },
  db_service: {
    name: 'Julian Lueilwitz',
    uid: '42343'
  },
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
      ],
      data_permission_different: {
        original_data_permission:
          'SELECT, INSERT, UPDATE, CREATE, REFERENCES, INDEX, ALTER, CREATE VIEW, SHOW VIEW, TRIGGER ON `test_db`.*'
      }
    },
    {
      data_objects: null,
      data_operations: [
        {
          uid: '600033',
          name: 'CREATE_USER'
        }
      ],
      data_permission_different: {
        original_data_permission: ''
      }
    }
  ],
  password_security_policy: '',
  status: 'unlock',
  password_managed: false,
  auth_users: ['t3'],
  db_roles: [
    {
      name: 'role1',
      uid: '123'
    }
  ]
};

export const discoveryDBAccountMockData: IDBAccountBody[] = [
  {
    user: 'root',
    permission_info: {
      grants: ['ALL PRIVILEGES ON *.* WITH GRANT OPTION']
    }
  },
  {
    user: 'mysql.session',
    permission_info: {
      grants: [
        'SUPER ON *.*',
        'SELECT ON `performance_schema`.*',
        'SELECT ON `mysql`.`user`'
      ]
    }
  }
];
