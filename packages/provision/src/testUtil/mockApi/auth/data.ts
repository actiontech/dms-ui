import {
  IDataObjectSource,
  IDatabase,
  IGetDataPermissionsInDataPermissionTemplate,
  IListAuthorizationEvent,
  IListDataObjectServiceEvent,
  IListDataPermissionTemplate,
  IListDataPermissionTemplateEvent,
  IListService,
  IOperation,
  IStatement,
  ITable,
  IUserInfo,
  IListInternalUser
} from '@actiontech/shared/lib/api/provision/service/common';
import {
  DataObjectSourceNameEnum,
  ListServiceDbTypeEnum,
  ListServiceTypeEnum,
  OperationInfoDbTypeEnum
} from '@actiontech/shared/lib/api/provision/service/common.enum';

export const userList: IListInternalUser[] = [
  {
    name: 'Dewey Connelly',
    user_uid: '85315'
  },
  {
    name: 'Edwin Schneider III',
    user_uid: '48548'
  },
  {
    name: 'Javier Beier IV',
    user_uid: '28060'
  },
  {
    name: 'Glenda Goyette',
    user_uid: '56796'
  },
  {
    name: 'Valerie Gerhold',
    user_uid: '4066'
  },
  {
    name: 'Mona Reinger',
    user_uid: '64872'
  },
  {
    name: 'Kari Bode',
    user_uid: '67483'
  },
  {
    name: 'Bryan Emard',
    user_uid: '39891'
  },
  {
    name: 'Clinton Gleason III',
    user_uid: '42706'
  },
  {
    name: 'Thelma Keeling',
    user_uid: '80115'
  },
  {
    name: 'Duane Hyatt',
    user_uid: '34369'
  },
  {
    name: 'Mr. Nancy Yundt',
    user_uid: '63949'
  },
  {
    name: 'Kristi Dickinson',
    user_uid: '47815'
  },
  {
    name: 'Cecelia Grimes',
    user_uid: '36601'
  },
  {
    name: 'Dr. Miriam Brekke',
    user_uid: '19951'
  },
  {
    name: 'Karen Herzog',
    user_uid: '97690'
  },
  {
    name: 'Mr. Taylor Rempel',
    user_uid: '27809'
  },
  {
    name: 'Kristina Hessel',
    user_uid: '56330'
  },
  {
    name: 'Delores Rowe IV',
    user_uid: '15376'
  },
  {
    name: 'Tammy Prosacco',
    user_uid: '61209'
  }
];

export const tipsList: string[] = ['tips1', 'tips2'];

export const instanceList: IListService[] = [
  {
    address: 'aromatic-hammock.org',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '1993-09-20 03:09:39',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Julian Lueilwitz',
    type: ListServiceTypeEnum.Service,
    uid: '42343',
    user: 'Brycen'
  },
  {
    address: 'zigzag-loneliness.com',
    last_sync_data_result: '',
    last_sync_data_time: '1993-09-20 03:09:39',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Gloria Kessler',
    type: ListServiceTypeEnum.Service,
    uid: '30152',
    user: 'Regan'
  },
  {
    address: 'guilty-marmalade.org',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '1993-09-20 03:09:39',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Tyler Mitchell',
    type: ListServiceTypeEnum.Service,
    uid: '5801',
    user: 'Maggie'
  },
  {
    address: 'oddball-doughnut.com',
    last_sync_data_result: '',
    last_sync_data_time: '1993-09-20 03:09:39',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Brent West',
    type: ListServiceTypeEnum.Service,
    uid: '16515',
    user: 'Vanessa'
  },
  {
    address: 'disloyal-sunlamp.org',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '1993-09-20 03:09:39',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Tabitha Herzog',
    type: ListServiceTypeEnum.Service,
    uid: '22995',
    user: 'Darrell'
  },
  {
    address: 'delightful-sense.net',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Nicole Barrows',
    type: ListServiceTypeEnum.Service,
    uid: '27015',
    user: 'Ettie'
  },
  {
    address: 'active-hosiery.name',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Nicolas Sawayn',
    type: ListServiceTypeEnum.Service,
    uid: '86240',
    user: 'Orval'
  },
  {
    address: 'droopy-footrest.com',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Miguel Spinka II',
    type: ListServiceTypeEnum.Service,
    uid: '48495',
    user: 'Otho'
  },
  {
    address: 'well-made-modification.name',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Roger Gutkowski',
    type: ListServiceTypeEnum.Service,
    uid: '13543',
    user: 'Ron'
  },
  {
    address: 'plush-wind.name',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Brett Rippin',
    type: ListServiceTypeEnum.Service,
    uid: '53533',
    user: 'Leonardo'
  },
  {
    address: 'quixotic-scheduling.info',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Gilberto Feil',
    type: ListServiceTypeEnum.Service,
    uid: '67069',
    user: 'Bailey'
  },
  {
    address: 'palatable-workout.biz',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Ms. Christine Bradtke I',
    type: ListServiceTypeEnum.Service,
    uid: '45638',
    user: 'Georgianna'
  },
  {
    address: 'massive-guacamole.biz',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Jermaine Ondricka',
    type: ListServiceTypeEnum.Service,
    uid: '20534',
    user: 'Gay'
  },
  {
    address: 'gentle-retirement.info',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Dr. Blanca Olson',
    type: ListServiceTypeEnum.Service,
    uid: '22430',
    user: 'Edgardo'
  },
  {
    address: 'soulful-dhow.biz',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Cory Lesch',
    type: ListServiceTypeEnum.Service,
    uid: '68337',
    user: 'Ernestine'
  },
  {
    address: 'elegant-bra.info',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Frances Kris',
    type: ListServiceTypeEnum.Service,
    uid: '47972',
    user: 'Esteban'
  },
  {
    address: 'unnatural-finish.info',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Shannon Flatley',
    type: ListServiceTypeEnum.Service,
    uid: '24435',
    user: 'Edison'
  },
  {
    address: 'pointless-current.info',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Kendra Christiansen',
    type: ListServiceTypeEnum.Service,
    uid: '92836',
    user: 'Daron'
  },
  {
    address: 'canine-bench.biz',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Ethel Pagac',
    type: ListServiceTypeEnum.Service,
    uid: '61669',
    user: 'Annabell'
  },
  {
    address: 'same-moose.biz',
    last_sync_data_result: 'error: error',
    last_sync_data_time: '0001-01-01T08:05:43.000+08:05',
    db_type: ListServiceDbTypeEnum.MySQL,
    name: 'Mrs. Marlene Miller',
    type: ListServiceTypeEnum.Service,
    uid: '70731',
    user: 'Scarlett'
  }
];

export const operationList: IOperation[] = [
  {
    name: 'enim esse culpa anim',
    uid: '72999044'
  },
  {
    name: 'ad',
    uid: '25943889'
  },
  {
    name: 'Tabitha Herzog',
    uid: '22995'
  },
  {
    name: 'Nicole Barrows',
    uid: '27015'
  },
  {
    name: 'Nicolas Sawayn',
    uid: '86240'
  },
  {
    name: 'Miguel Spinka II',
    uid: '48495'
  },
  {
    name: 'Roger Gutkowski',
    uid: '13543'
  },
  {
    name: 'Brett Rippin',
    uid: '53533'
  }
];

export const operationSetList: any = [
  {
    uid: '27',
    name: '查询',
    operations: [
      {
        data_object_types: ['Database', 'Table', 'Instance'],
        data_operations: [
          {
            uid: '86',
            name: 'select'
          }
        ],
        db_type: OperationInfoDbTypeEnum.MySQL
      },
      {
        data_object_types: ['Database', 'Table', 'Instance'],
        data_operations: [
          {
            uid: '87',
            name: 'select'
          }
        ],
        db_type: OperationInfoDbTypeEnum.OceanBaseMySQL
      }
    ]
  },
  {
    uid: '96',
    name: '变更',
    operations: [
      {
        db_type: OperationInfoDbTypeEnum.MySQL,
        data_object_types: ['Service', 'Instance'],
        data_operations: [
          {
            name: 'select',
            uid: '8'
          },
          {
            uid: '67',
            name: 'delete'
          },
          {
            uid: '15',
            name: 'add'
          }
        ]
      },
      {
        data_object_types: ['Database', 'Table', 'Instance'],
        data_operations: [
          {
            uid: '80',
            name: 'add'
          }
        ],
        db_type: OperationInfoDbTypeEnum.OceanBaseMySQL
      }
    ]
  },
  {
    uid: '36',
    name: '导出',
    operations: [
      {
        db_type: OperationInfoDbTypeEnum.MySQL,
        data_operations: [
          {
            name: 'update',
            uid: '57'
          },
          {
            name: 'select',
            uid: '49'
          },
          {
            uid: '31',
            name: 'remove'
          }
        ],
        data_object_types: ['Instance', 'Database']
      },
      {
        data_object_types: ['Database', 'Table', 'Instance'],
        data_operations: [
          {
            uid: '80',
            name: 'add'
          },
          {
            name: 'update',
            uid: '57'
          }
        ],
        db_type: OperationInfoDbTypeEnum.OceanBaseMySQL
      }
    ]
  }
];

export const databaseList: IDatabase[] = [
  {
    name: 'database-1',
    uid: '1'
  },
  {
    name: 'database-2',
    uid: '2'
  },
  {
    name: 'database-3',
    uid: '3'
  },
  {
    name: 'database-4',
    uid: '4'
  }
];

export const tableList: ITable[] = [
  {
    name: 'table-1',
    uid: '1'
  },
  {
    name: 'table-2',
    uid: '2'
  },
  {
    name: 'table-3',
    uid: '3'
  },
  {
    name: 'table-4',
    uid: '4'
  }
];

export const DataPermissionList: IGetDataPermissionsInDataPermissionTemplate[] =
  [
    {
      service_name: 'a',
      data_operation_sets: [
        {
          uid: '601000',
          name: '全部'
        },
        {
          name: '601003',
          uid: '删除'
        },
        {
          name: '变更',
          uid: '601002'
        },
        {
          name: '授权',
          uid: '601005'
        }
      ],
      data_objects: [
        {
          database_uid: '1588045841568894976',
          table_uid: '1588045841610838016',
          name: 'information_schema.CHARACTER_SETS'
        },
        {
          database_uid: '1588045841568894976',
          name: 'information_schema.COLLATIONS',
          table_uid: '1588045841631809536'
        },
        {
          database_uid: '1588045842994958336',
          name: 'mysql.*'
        }
      ],
      service_uid: '1588045839480131584',
      business: 'a'
    }
  ];

export const templateList: IListDataPermissionTemplate[] = [
  {
    authorization_purpose: ['sed', 'ut occaecat culpa'],
    create_user: 'dolor magna ipsum',
    memo: 'consectetur commodo dolore',
    uid: '69',
    name: 'template-1',
    created_at: '1993-09-20 03:09:39'
  },
  {
    memo: 'reprehenderit labore eiusmod aliquip exercitation',
    created_at: '1990-09-11 13:26:59',
    name: 'template-2',
    uid: '55',
    create_user: 'Ut ut deserunt ut mollit',
    authorization_purpose: [
      'Duis quis nisi cillum Lorem',
      'labore Ut sint aute eiusmod',
      'do Ut ipsum laboris consectetur',
      'est consectetur',
      'reprehenderit dolor sunt voluptate'
    ]
  },
  {
    name: 'template-3',
    authorization_purpose: [
      'officia elit nostrud id ipsum',
      'incididunt dolore occaecat dolore velit',
      'in dolor et enim adipisicing'
    ],
    uid: '46',
    memo: 'aliqua',
    created_at: '1997-11-12 23:57:43',
    create_user: 'eu'
  }
];

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

export const accountListByService: IUserInfo[] = [
  {
    user: 'root',
    host: 'localhost',
    privileges: ['ALL PRIVILEGES ON *.* WITH GRANT OPTION']
  },
  {
    user: 'mysql.session',
    host: 'localhost',
    privileges: [
      'SUPER ON *.*',
      'SELECT ON `performance_schema`.*',
      'SELECT ON `mysql`.`user`'
    ]
  },
  {
    user: 'mysql.sys',
    host: 'localhost',
    privileges: ['TRIGGER ON `sys`.*', 'SELECT ON `sys`.`sys_config`']
  },
  {
    user: 'root',
    host: '%',
    privileges: ['ALL PRIVILEGES ON *.* WITH GRANT OPTION']
  }
];

export const dataSourceList: IDataObjectSource[] = [
  {
    last_sync_error:
      'sunt aliqua officia cupidatat sunt aliqua officia cupidatat sunt aliqua officia cupidatat sunt aliqua officia cupidatat',
    name: DataObjectSourceNameEnum['Actiontech DMP'],
    version: '9.9.9.9',
    uid: '3',
    sync_cron: '* * * * *',
    address: '10.186.62.27'
  },
  {
    last_sync_error: '',
    name: DataObjectSourceNameEnum['Actiontech DMP'],
    version: '4.20.05.3',
    uid: '4',
    sync_cron: '* * * * *',
    address: '10.186.62.28'
  },
  {
    last_sync_error: '',
    name: DataObjectSourceNameEnum['Actiontech DMP'],
    version: '9.9.9.9',
    uid: '6',
    sync_cron: '* * * * *',
    address: '10.186.62.90'
  }
];

export const businesses: string[] = ['business-1', 'business-2', 'business-3'];

export const authAuditList: IListAuthorizationEvent[] = [
  {
    generated_time: '2022-12-29T17:20:53.012+08:00',
    event_uid: '1',
    data_permission_templates: [
      {
        name: 'temp-1',
        uid: '1'
      }
    ],
    db_account_explanation: 'explanation-1',
    db_account_hostname: 'hostname-1',
    db_account_name: 'accountname-1',
    event_type: 'auth_created',
    executing_user_name: 'username-1',
    executing_user_uid: '456',
    permission_user_name: 'permissionname',
    permission_user_uid: '789',
    purpose: 'purpose-1'
  },
  {
    generated_time: '2022-12-29T17:21:53.012+08:00',
    event_uid: '2',
    data_permission_templates: [
      {
        name: 'temp-2',
        uid: '2'
      }
    ],

    db_account_explanation: 'explanation-2',
    db_account_hostname: 'hostname-2',
    db_account_name: 'accountname-2',
    event_type: 'auth_updated',
    executing_user_name: 'username-2',
    executing_user_uid: '456',
    memo: 'memo',
    permission_user_name: 'permissionname',
    permission_user_uid: '789',
    purpose: 'purpose-1'
  },
  {
    generated_time: '2022-12-29T17:22:53.012+08:00',
    event_uid: '3',
    data_permission_templates: [
      {
        name: 'temp-3',
        uid: '3'
      }
    ],

    db_account_explanation: 'explanation-3',
    db_account_hostname: 'hostname-3',
    db_account_name: 'accountname-3',
    event_type: 'auth_deleted',
    executing_user_name: 'username-3',
    executing_user_uid: '456',
    memo: 'memo',
    permission_user_name: 'permissionname',
    permission_user_uid: '789',
    purpose: 'purpose-1'
  }
];

export const templateAuditList: IListDataPermissionTemplateEvent[] = [
  {
    generated_time: '2022-12-29T17:20:53.012+08:00',
    event_uid: '4',
    data_permission_template_name: 'temp-1',
    data_permission_template_uid: '123',
    event_type: 'data_permission_template_created',
    executing_user_name: 'username-1',
    executing_user_uid: '456',
    data_permissions: [
      {
        data_object_service_name: 'service-1',
        data_objects: ['123', '456'],
        data_operations: ['789']
      },
      {
        data_object_service_name: 'service-2',
        data_objects: ['aaa', 'bbb'],
        data_operations: ['ccc']
      },
      {
        data_object_service_name: 'service-3',
        data_objects: ['ddd', 'eee'],
        data_operations: ['fff']
      }
    ]
  },
  {
    generated_time: '2022-12-29T17:21:53.012+08:00',
    event_uid: '5',
    data_permission_template_name: 'temp-2',
    data_permission_template_uid: '123',
    event_type: 'data_permission_template_updated',
    executing_user_name: 'username-2',
    executing_user_uid: '456',
    data_permissions: [
      {
        data_object_service_name: 'service-1',
        data_objects: ['123', '456'],
        data_operations: ['789']
      }
    ]
  },
  {
    generated_time: '2022-12-29T17:22:53.012+08:00',
    event_uid: '6',
    data_permission_template_name: 'temp-3',
    data_permission_template_uid: '123',
    event_type: 'data_permission_template_deleted',
    executing_user_name: 'username-3',
    executing_user_uid: '456',
    data_permissions: [
      {
        data_object_service_name: 'service-1',
        data_objects: ['123', '456'],
        data_operations: ['789']
      }
    ]
  }
];

export const serviceAuditList: IListDataObjectServiceEvent[] = [
  {
    generated_time: '2022-12-29T17:20:53.012+08:00',
    event_uid: '7',
    data_object_service_name: 'service-1',
    business: 'business-1',
    operation: 'select * '
  },
  {
    generated_time: '2022-12-29T17:21:53.012+08:00',
    event_uid: '8',
    data_object_service_name: 'service-2',
    business: 'business-2',
    operation: 'select * '
  },
  {
    generated_time: '2022-12-29T17:22:53.012+08:00',
    event_uid: '9',
    data_object_service_name: 'service-3',
    business: 'business-3',
    operation: 'select * '
  }
];

export const mockDBOperationsData = [
  {
    uid: '600010',
    name: 'ALL',
    scope: ['Service', 'Instance', 'Database', 'Table', 'Routine']
  },
  {
    uid: '600015',
    name: 'ALTER',
    scope: ['Service', 'Instance', 'Database', 'Table']
  },
  {
    uid: '600024',
    name: 'ALTER_ROUTINE',
    scope: ['Service', 'Instance', 'Database', 'Routine']
  },
  {
    uid: '600016',
    name: 'CREATE',
    scope: ['Service', 'Instance', 'Database', 'Table']
  },
  {
    uid: '600032',
    name: 'CREATE_TEMPORARY_TABLES',
    scope: ['Service', 'Instance', 'Database']
  },
  {
    uid: '600033',
    name: 'CREATE_USER',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600020',
    name: 'CREATE_VIEW',
    scope: ['Service', 'Instance', 'Database', 'Table']
  },
  {
    uid: '600013',
    name: 'DELETE',
    scope: ['Service', 'Instance', 'Database', 'Table']
  },
  {
    uid: '600017',
    name: 'DROP',
    scope: ['Service', 'Instance', 'Database', 'Table']
  },
  {
    uid: '600035',
    name: 'EVENT',
    scope: ['Service', 'Instance', 'Database']
  },
  {
    uid: '600025',
    name: 'EXECUTE',
    scope: ['Service', 'Instance', 'Database', 'Routine']
  },
  {
    uid: '600027',
    name: 'FILE',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600018',
    name: 'GRANT',
    scope: ['Service', 'Instance', 'Database', 'Table', 'Routine']
  },
  {
    uid: '600021',
    name: 'INDEX',
    scope: ['Service', 'Instance', 'Database', 'Table']
  },
  {
    uid: '600012',
    name: 'INSERT',
    scope: ['Service', 'Instance', 'Database', 'Table', 'Column']
  },
  {
    uid: '600026',
    name: 'LOCK_TABLES',
    scope: ['Service', 'Instance', 'Database']
  },
  {
    uid: '600036',
    name: 'PROCESS',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600019',
    name: 'REFERENCES',
    scope: ['Service', 'Instance', 'Database', 'Table', 'Column']
  },
  {
    uid: '600037',
    name: 'RELOAD',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600038',
    name: 'REPLICATION_CLIENT',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600039',
    name: 'REPLICATION_SLAVE',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600011',
    name: 'SELECT',
    scope: ['Service', 'Instance', 'Database', 'Table', 'Column']
  },
  {
    uid: '600029',
    name: 'SHOW_DATABASES',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600022',
    name: 'SHOW_VIEW',
    scope: ['Service', 'Instance', 'Database', 'Table']
  },
  {
    uid: '600040',
    name: 'SHUTDOWN',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600041',
    name: 'SUPER',
    scope: ['Service', 'Instance']
  },
  {
    uid: '600023',
    name: 'TRIGGER',
    scope: ['Service', 'Instance', 'Database', 'Table']
  },
  {
    uid: '600014',
    name: 'UPDATE',
    scope: ['Service', 'Instance', 'Database', 'Table', 'Column']
  }
];
