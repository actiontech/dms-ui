import {
  IOperationTypeNameList,
  IOperationActionList
} from '../../../../api/sqle/service/common';
import { IOperationRecordListItem } from '../../../../api/base/service/common';
import { OperationRecordListItemStatusEnum } from '../../../../api/base/service/common.enum';

export const operationRecordListMockData: IOperationRecordListItem[] = [
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
    status: OperationRecordListItemStatusEnum.succeeded,
    operation_user_agent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
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
    project_name: '',
    status: OperationRecordListItemStatusEnum.failed,
    operation_user_agent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
  },
  {
    id: 52,
    operation_time: '2024-01-03T11:27:27+08:00',
    operation_type_name: '流程模板',
    operation_action: '编辑流程模板',
    operation_content: '编辑流程模板',
    project_name: ''
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
