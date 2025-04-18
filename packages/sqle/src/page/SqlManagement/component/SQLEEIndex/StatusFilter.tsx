import { useTranslation } from 'react-i18next';
import { BasicSegmented } from '@actiontech/shared';
import { sqlManagementDictionary } from '../../../../hooks/useStaticStatus/index.data';
import { GetSqlManageListV3FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';

export type TypeStatus = GetSqlManageListV3FilterStatusEnum | 'all';

interface IStatusFilter {
  status: TypeStatus;
  onChange: (status: TypeStatus) => void;
}

const StatusFilter = ({ status, onChange }: IStatusFilter) => {
  const { t } = useTranslation();

  return (
    <BasicSegmented
      value={status}
      onChange={(v) => {
        const key = v as typeof status;
        onChange(key);
      }}
      options={['all', ...Object.keys(GetSqlManageListV3FilterStatusEnum)].map(
        (v) => {
          const key = v as typeof status;
          return {
            label:
              key === 'all'
                ? t('common.all')
                : t(
                    sqlManagementDictionary[
                      GetSqlManageListV3FilterStatusEnum[key]
                    ]
                  ),
            value: key
          };
        }
      )}
    />
  );
};

export default StatusFilter;
