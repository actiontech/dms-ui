import { IAssociateWorkflows } from '@actiontech/shared/lib/api/sqle/service/common';
import { useTranslation } from 'react-i18next';
import WorkflowStatus from '../../../../../SqlExecWorkflow/List/components/WorkflowStatus';
import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BasicTable, BasicTableProps } from '@actiontech/shared';

const WorkflowTableField: React.FC<{
  value?: React.Key[];
  onChange?: (value: React.Key[]) => void;
  workflowList?: IAssociateWorkflows[];
  loading: boolean;
}> = ({ loading, workflowList, onChange, value }) => {
  const { t } = useTranslation();

  const onSelectChange = (keys: React.Key[]) => {
    onChange?.(keys);
  };

  const columns: BasicTableProps<IAssociateWorkflows>['columns'] = [
    {
      dataIndex: 'workflow_name',
      title: t('versionManagement.associateWorkflow.workflowName')
    },
    {
      dataIndex: 'status',
      title: t('versionManagement.associateWorkflow.workflowStatus'),
      render: (status: string) => (
        <WorkflowStatus
          status={status as unknown as WorkflowDetailResV1StatusEnum}
        />
      )
    },
    {
      dataIndex: 'desc',
      title: t('versionManagement.associateWorkflow.workflowDesc'),
      render: (desc: string) => desc || '-'
    }
  ];

  return (
    <BasicTable
      loading={loading}
      dataSource={workflowList}
      columns={columns}
      rowSelection={{
        selectedRowKeys: value,
        onChange: onSelectChange,
        fixed: true
      }}
      rowKey="workflow_id"
    />
  );
};

export default WorkflowTableField;
