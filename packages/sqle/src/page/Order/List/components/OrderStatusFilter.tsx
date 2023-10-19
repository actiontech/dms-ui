import { orderStatusDictionary } from '../../../../hooks/useStaticStatus/index.data';
import { useTranslation } from 'react-i18next';
import { BasicSegmented } from '@actiontech/shared';
import { getWorkflowsV1FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';

const OrderStatusFilter: React.FC<{
  status: getWorkflowsV1FilterStatusEnum | 'all';
  onChange: (status: getWorkflowsV1FilterStatusEnum | 'all') => void;
}> = ({ status, onChange }) => {
  const { t } = useTranslation();
  return (
    <BasicSegmented
      value={status}
      onChange={(v) => {
        const key = v as typeof status;
        onChange(key);
      }}
      options={['all', ...Object.keys(getWorkflowsV1FilterStatusEnum)].map(
        (v) => {
          const key = v as typeof status;
          return {
            label:
              key === 'all'
                ? t('common.all')
                : t(orderStatusDictionary[getWorkflowsV1FilterStatusEnum[key]]),
            value: key
          };
        }
      )}
    />
  );
};

export default OrderStatusFilter;
