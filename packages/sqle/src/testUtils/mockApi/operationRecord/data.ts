import {
  IOperationRecordList,
  IOperationTypeNameList,
  IOperationActionList
} from '@actiontech/shared/lib/api/sqle/service/common';
import { OperationRecordListStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const operationRecordListMockData: IOperationRecordList[] = [
  {
    id: 54,
    operation_time: '2024-01-03T11:28:34+08:00',
    operation_user: {
      user_name: 'admin',
      ip: '192.168.22.31'
    },
    operation_type_name: '流程模板',
    operation_action: '编辑流程模板',
    operation_content: '编辑流程模板',
    project_name: 'default',
    status: OperationRecordListStatusEnum.succeeded
  },
  {
    id: 53,
    operation_time: '2024-01-03T11:27:27+08:00',
    operation_user: {
      user_name: 'admin',
      ip: '192.168.22.33'
    },
    operation_type_name: '流程模板',
    operation_action: '编辑流程模板',
    operation_content: '编辑流程模板',
    project_name: 'default',
    status: OperationRecordListStatusEnum.failed
  }
];

export const operationTypeNameMockData: IOperationTypeNameList[] = [
  {
    operation_type_name: 'operation_type_name1',
    desc: '操作类型'
  }
];

export const operationActionMockData: IOperationActionList[] = [
  {
    operation_type: 'project',
    operation_action: 'create_project',
    desc: '创建项目'
  },
  {
    operation_type: 'instance',
    operation_action: 'delete_instance',
    desc: '删除数据源'
  },
  {
    operation_type: 'audit_plan',
    operation_action: 'create_audit_plan',
    desc: '创建智能扫描任务'
  }
];
