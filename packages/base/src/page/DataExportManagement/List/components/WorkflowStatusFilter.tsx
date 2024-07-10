import { useTranslation } from 'react-i18next';
import { BasicSegmented } from '@actiontech/shared';
import { ListDataExportWorkflowsFilterByStatusEnum } from '@actiontech/shared/lib/api/base/service/DataExportWorkflows/index.enum';
import { DataExportStatusDictionary } from '../../Common/index.data';

const WorkflowStatusFilter: React.FC<{
  status: ListDataExportWorkflowsFilterByStatusEnum | 'all';
  onChange: (status: ListDataExportWorkflowsFilterByStatusEnum | 'all') => void;
}> = ({ status, onChange }) => {
  const { t } = useTranslation();
  return (
    <BasicSegmented
      value={status}
      onChange={(v) => {
        const key = v as typeof status;
        onChange(key);
      }}
      options={[
        'all',
        ...Object.keys(ListDataExportWorkflowsFilterByStatusEnum)
      ].map((v) => {
        const key = v as typeof status;
        return {
          label:
            key === 'all'
              ? t('common.all')
              : DataExportStatusDictionary[
                  ListDataExportWorkflowsFilterByStatusEnum[key]
                ],
          value: key
        };
      })}
    />
  );
};

export default WorkflowStatusFilter;
