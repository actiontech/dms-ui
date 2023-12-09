import { IListUser } from '@actiontech/shared/lib/api/base/service/common';
import {
  IDataObjectSource,
  IDataOperationSet,
  IDatabase,
  IGetAuthorizationReply,
  IGetDataPermissionsInDataPermissionTemplate,
  IListAuthorization,
  IListAuthorizationEvent,
  IListDBAccountByAuth,
  IListDataObjectServiceEvent,
  IListDataPermissionTemplate,
  IListDataPermissionTemplateEvent,
  IListInternalUser,
  IListService,
  IOperation,
  IStatement,
  ITable,
  IUserInfo
} from '@actiontech/shared/lib/api/provision/service/common';
import {
  DataObjectSourceNameEnum,
  ListAuthorizationStatusEnum,
  ListServiceDbTypeEnum,
  ListServiceTypeEnum,
  OperationInfoDbTypeEnum
} from '@actiontech/shared/lib/api/provision/service/common.enum';

export const userList: IListUser[] = [
  {
    name: 'Dewey Connelly',
    uid: '85315'
  },
  {
    name: 'Edwin Schneider III',
    uid: '48548'
  },
  {
    name: 'Javier Beier IV',
    uid: '28060'
  },
  {
    name: 'Glenda Goyette',
    uid: '56796'
  },
  {
    name: 'Valerie Gerhold',
    uid: '4066'
  },
  {
    name: 'Mona Reinger',
    uid: '64872'
  },
  {
    name: 'Kari Bode',
    uid: '67483'
  },
  {
    name: 'Bryan Emard',
    uid: '39891'
  },
  {
    name: 'Clinton Gleason III',
    uid: '42706'
  },
  {
    name: 'Thelma Keeling',
    uid: '80115'
  },
  {
    name: 'Duane Hyatt',
    uid: '34369'
  },
  {
    name: 'Mr. Nancy Yundt',
    uid: '63949'
  },
  {
    name: 'Kristi Dickinson',
    uid: '47815'
  },
  {
    name: 'Cecelia Grimes',
    uid: '36601'
  },
  {
    name: 'Dr. Miriam Brekke',
    uid: '19951'
  },
  {
    name: 'Karen Herzog',
    uid: '97690'
  },
  {
    name: 'Mr. Taylor Rempel',
    uid: '27809'
  },
  {
    name: 'Kristina Hessel',
    uid: '56330'
  },
  {
    name: 'Delores Rowe IV',
    uid: '15376'
  },
  {
    name: 'Tammy Prosacco',
    uid: '61209'
  }
];

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

export const operationSetList: IDataOperationSet[] = [
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

export const authorizationList: IListAuthorization[] = [
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      },
      {
        data_object_service_dns: 'service-2',
        data_object_service_uid: '456',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['template-2', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'authorization-001',
    uid: '85315',
    permission_user: 'Edwin Schneider III',
    last_update_at: '1974-01-26T13:53:45Z',
    memo: 'Bayer, Kovacek and Braun',
    status: ListAuthorizationStatusEnum.effective
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1993', 'temp-6666'],
    expiration: 123445,
    purpose: 'Edwin Schneider III',
    uid: '48548',
    permission_user: '1993',
    last_update_at: '1974-03-17T20:30:46Z',
    memo: 'Frami Inc',
    status: ListAuthorizationStatusEnum.expiring
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1970', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Javier Beier IV',
    uid: '28060',
    permission_user: '1970',
    last_update_at: '1944-05-18T17:03:28Z',
    memo: 'Koch - Bernhard',
    status: ListAuthorizationStatusEnum.expiring
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1992', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Glenda Goyette',
    uid: '56796',
    permission_user: '1992',
    last_update_at: '2000-10-27T04:32:58Z',
    memo: 'Simonis, Pfeffer and Cronin',
    status: ListAuthorizationStatusEnum.expiring
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1957', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Valerie Gerhold',
    uid: '4066',
    permission_user: '1957',
    last_update_at: '1946-06-17T03:52:51Z',
    memo: 'Doyle - Kovacek',
    status: ListAuthorizationStatusEnum.expiring
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1948', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Mona Reinger',
    uid: '64872',
    permission_user: '1948',
    last_update_at: '1973-08-29T01:31:48Z',
    memo: 'Jones, Breitenberg and Satterfield',
    status: ListAuthorizationStatusEnum.expiring
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-2004', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Kari Bode',
    uid: '67483',
    permission_user: '2004',
    last_update_at: '1984-01-11T22:16:05Z',
    memo: 'Reynolds - White',
    status: ListAuthorizationStatusEnum.expiring
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1998', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Bryan Emard',
    uid: '39891',
    permission_user: '1998',
    last_update_at: '1976-04-20T08:37:01Z',
    memo: "O'Hara, Pfannerstill and Rutherford",
    status: ListAuthorizationStatusEnum.effective
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1991', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Clinton Gleason III',
    uid: '42706',
    permission_user: '1991',
    last_update_at: '1975-12-26T13:21:05Z',
    memo: 'Gusikowski - Cummings',
    status: ListAuthorizationStatusEnum.effective
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1956', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Thelma Keeling',
    uid: '80115',
    permission_user: '1956',
    last_update_at: '1992-04-04T09:30:06Z',
    memo: 'Dare, Bernier and Gusikowski',
    status: ListAuthorizationStatusEnum.effective
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-2001', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Duane Hyatt',
    uid: '34369',
    permission_user: '2001',
    last_update_at: '1989-06-11T06:21:42Z',
    memo: 'Schaefer, Konopelski and Price',
    status: ListAuthorizationStatusEnum.effective
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1993', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Mr. Nancy Yundt',
    uid: '63949',
    permission_user: '1993',
    last_update_at: '1950-10-25T13:54:31Z',
    memo: 'Rosenbaum - Grady',
    status: ListAuthorizationStatusEnum.effective
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1949', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Kristi Dickinson',
    uid: '47815',
    permission_user: '1949',
    last_update_at: '1994-06-19T05:03:15Z',
    memo: 'Prosacco - Bergnaum',
    status: ListAuthorizationStatusEnum.effective
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1953', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Cecelia Grimes',
    uid: '36601',
    permission_user: '1953',
    last_update_at: '1970-03-11T19:10:52Z',
    memo: 'Dicki, Hegmann and Hyatt',
    status: ListAuthorizationStatusEnum.effective
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1967', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Dr. Miriam Brekke',
    uid: '19951',
    permission_user: '1967',
    last_update_at: '1990-06-02T23:12:08Z',
    memo: 'Schuppe Group',
    status: ListAuthorizationStatusEnum.expired
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1956', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Karen Herzog',
    uid: '97690',
    permission_user: '1956',
    last_update_at: '1951-10-04T22:13:18Z',
    memo: 'Bode - Crona',
    status: ListAuthorizationStatusEnum.expired
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1956', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Mr. Taylor Rempel',
    uid: '27809',
    permission_user: '1956',
    last_update_at: '2000-09-11T23:06:23Z',
    memo: 'Blick, Erdman and Jakubowski',
    status: ListAuthorizationStatusEnum.expired
  },
  {
    businesses: 't onnu rue',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1983', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Kristina Hessel',
    uid: '56330',
    permission_user: '1983',
    last_update_at: '1950-10-27T09:56:50Z',
    memo: 'Hodkiewicz LLC',
    status: ListAuthorizationStatusEnum.expired
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1954', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Delores Rowe IV',
    uid: '15376',
    permission_user: '1954',
    last_update_at: '1972-01-29T12:50:43Z',
    memo: 'Cremin, Wilderman and Erdman',
    status: ListAuthorizationStatusEnum.expired
  },
  {
    businesses: 'f onnu alse',
    data_object_service: [
      {
        data_object_service_dns: 'service-1',
        data_object_service_uid: '123',
        data_object_service_user: 'root'
      }
    ],
    data_permission_template_names: ['temp-1971', 'temp-6666'],
    expiration: 1232132434332312,
    purpose: 'Tammy Prosacco',
    uid: '61209',
    permission_user: '1971',
    last_update_at: '1991-01-05T16:26:17Z',
    memo: 'Johnson, Stanton and Raynor',
    status: ListAuthorizationStatusEnum.expired
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

export const DBAccountList: IListDBAccountByAuth[] = [
  {
    password: 'asfnmksjdbnf',
    hostname: '%',
    connection_cmd: 'mysql -u -p123',
    user: 'root',
    explanation: '应用访问',
    data_object_service_dns: '12.212.122.12:3306',
    uid: '53'
  },
  {
    password: 'asdfasfsdfs',
    hostname: '%',
    connection_cmd: 'mysql -u -p123',
    user: 'root',
    explanation: '应用访问',
    data_object_service_dns: '12.212.122.12:3307',
    uid: '54'
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

export const AuthorizationDetails: IGetAuthorizationReply['data'] = {
  businesses: 'business-1',
  data_permissions: [
    {
      business: 'business-1',
      service_name: 'service-1',
      service_uid: '1590941990801903616',
      data_objects: [
        {
          database_uid: '1590941993851162624',
          name: 'mysql.columns_priv',
          table_uid: '1590941993876328448'
        },
        {
          database_uid: '123',
          name: 'mysql.table1',
          table_uid: '234'
        },
        {
          database_uid: '345',
          name: 'mysql.table2',
          table_uid: '456'
        }
      ],
      data_operation_sets: [
        {
          name: '读取',
          uid: '601001'
        },
        {
          name: '全部',
          uid: '601002'
        }
      ]
    }
  ],
  db_accounts: [
    {
      uid: '1592070730185445376',
      user: 'admin',
      hostname: '%',
      password: 'a',
      connection_cmd: 'mysql -u admin -h 10.186.62.27 -P 33061 -pa',
      data_object_service_dns: '10.186.62.27:33061',
      explanation: ''
    }
  ],
  memo: '',
  permission_user: 'ass',
  purpose: 'ass'
};

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
