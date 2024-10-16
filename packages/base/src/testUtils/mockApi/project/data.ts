import {
  IListProject,
  IPreviewImportProjects,
  IProjectTips,
  IDBService
} from '@actiontech/shared/lib/api/base/service/common';
import { ListProjectProjectPriorityEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const mockProjectList: IListProject[] = [
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
    project_priority: ListProjectProjectPriorityEnum.high
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
    business: [
      {
        id: 'business1',
        name: 'business1',
        is_used: true
      }
    ],
    is_fixed_business: true,
    project_priority: ListProjectProjectPriorityEnum.medium
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
    business: [
      {
        id: 'business1',
        name: 'business1',
        is_used: true
      },
      {
        id: 'business2',
        name: 'business2',
        is_used: false
      },
      {
        id: 'business3',
        name: 'business3',
        is_used: true
      }
    ],
    is_fixed_business: true
  }
];

export const mockPreviewImportProjects: IPreviewImportProjects[] = [
  {
    name: 'project1',
    business: ['business1', 'business2', 'business3'],
    desc: 'desc1'
  },
  {
    name: 'project2',
    business: ['business1'],
    desc: ''
  },
  {
    name: 'project3',
    business: ['']
  },
  {
    name: ''
  }
];

export const mockProjectTips: IProjectTips[] = [
  {
    is_fixed_business: true,
    business: ['business1', 'business2', 'business3']
  }
];

export const mockBatchImportDBCheckData: IDBService[] = [
  {
    name: 'mysql_1',
    db_type: 'MySQL',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    business: 'test',
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
    business: 'test',
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

export const mockDbServicesConnectionData = {
  successful_num: 1,
  failed_num: 1,
  failed_names: ['mysql_1']
};
