import {
  IListProjectV2,
  IPreviewImportProjectsV2,
  IProjectTips,
  IImportDBServiceV2,
  IEnvironmentTag,
  IBusinessTag,
  ICheckDBServicesPrivilegesItem
} from '../../../../api/base/service/common';
import { ListProjectV2ProjectPriorityEnum } from '../../../../api/base/service/common.enum';

export const mockProjectList: IListProjectV2[] = [
  {
    uid: '100121',
    name: 'test_project_1',
    desc: 'test project 1 desc',
    archived: true,
    create_time: '2023-06-01T10:00:00.000Z',
    create_user: {
      uid: '700101',
      name: 'admin'
    },
    project_priority: ListProjectV2ProjectPriorityEnum.high
  },
  {
    uid: '100122',
    name: 'test_project_2',
    desc: 'test project 2 desc',
    archived: false,
    create_time: '2023-05-31T12:21:55.000Z',
    create_user: {
      uid: '100231',
      name: 'test_user1'
    },
    business_tag: {
      uid: '1',
      name: 'business1'
    },
    project_priority: ListProjectV2ProjectPriorityEnum.medium
  },
  {
    uid: '100133',
    name: 'test_project_3',
    desc: 'test project 3 desc',
    archived: true,
    create_time: '2023-05-21T15:43:10.000Z',
    create_user: {
      uid: '100231',
      name: 'test_user1'
    },
    business_tag: {
      uid: '2',
      name: 'business2'
    }
  }
];

export const mockPreviewImportProjects: IPreviewImportProjectsV2[] = [
  {
    name: 'project1',
    business_tag: {
      uid: '1',
      name: 'business1'
    },
    desc: 'desc1'
  },
  {
    name: 'project2',
    business_tag: {
      uid: '2',
      name: 'business2'
    },
    desc: ''
  },
  {
    name: 'project3',
    business_tag: {
      uid: '3',
      name: 'business3'
    }
  },
  {
    name: ''
  }
];

export const mockBatchImportDBCheckData: IImportDBServiceV2[] = [
  {
    name: 'mysql_1',
    db_type: 'MySQL',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    environment_tag_name: 'environment-1',
    maintenance_times: [
      {
        maintenance_start_time: {
          hour: 21,
          minute: 30
        },
        maintenance_stop_time: {
          hour: 23,
          minute: 30
        }
      }
    ],
    desc: 'mysql_1',
    sqle_config: {
      rule_template_name: 'default_MySQL',
      rule_template_id: '1',
      sql_query_config: {
        max_pre_query_rows: 0,
        query_timeout_second: 0,
        audit_enabled: true
      }
    },
    is_enable_masking: false
  },
  {
    name: 'oracle_1',
    db_type: 'Oracle',
    host: '127.0.0.1',
    port: '1521',
    user: 'system',
    password: '123456',
    environment_tag_name: 'environment-2',
    maintenance_times: [],
    desc: 'oracle_1',
    sqle_config: {
      rule_template_name: 'default_Oracle',
      rule_template_id: '2',
      sql_query_config: {
        max_pre_query_rows: 0,
        query_timeout_second: 0,
        audit_enabled: true
      }
    },
    additional_params: [
      {
        name: 'service_name',
        value: 'xe',
        description: 'service name',
        type: 'string'
      }
    ],
    is_enable_masking: false
  }
];

export const mockCheckDBServicesPrivilegesData: ICheckDBServicesPrivilegesItem[] =
  [
    {
      CheckDBServicesPrivileges: [
        {
          component: 'slqe',
          is_connectable: true,
          connect_error_message: undefined
        },
        {
          component: 'provision',
          is_connectable: true,
          connect_error_message: undefined
        }
      ]
    },
    {
      CheckDBServicesPrivileges: [
        {
          component: 'slqe',
          is_connectable: true,
          connect_error_message: undefined
        }
      ]
    }
  ];

export const mockCheckDBServicesPrivilegesIncludeErrorData: ICheckDBServicesPrivilegesItem[] =
  [
    {
      CheckDBServicesPrivileges: [
        {
          component: 'slqe',
          is_connectable: false,
          connect_error_message: '权限不足'
        },
        {
          component: 'provision',
          is_connectable: true,
          connect_error_message: undefined
        }
      ]
    },
    {
      CheckDBServicesPrivileges: [
        {
          component: 'slqe',
          is_connectable: true,
          connect_error_message: undefined
        }
      ]
    }
  ];

export const mockDbServicesConnectionData = {
  successful_num: 1,
  failed_num: 1,
  failed_names: ['mysql_1']
};

export const mockEnvironmentTagsData: IEnvironmentTag[] = [
  {
    uid: '1',
    name: 'environment-1'
  },
  {
    uid: '2',
    name: 'environment-2'
  }
];

export const mockBusinessTagsData: IBusinessTag[] = [
  {
    uid: '1',
    name: 'business-1'
  },
  {
    uid: '2',
    name: 'business-2'
  }
];
