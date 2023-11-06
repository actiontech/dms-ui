import { useTranslation } from 'react-i18next';
import { SqlManageStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BasicTag } from '@actiontech/shared';
import { useMemo } from 'react';
import { BasicTagColor } from '@actiontech/shared/lib/theme/theme.type';

export interface IStatusTag {
  status: SqlManageStatusEnum;
}

const StatusTag = ({ status }: IStatusTag) => {
  const { t } = useTranslation();
  const color = useMemo(() => {
    const allColor = {
      unhandled: 'red',
      solved: 'green',
      ignored: 'gray',
      manual_audited: 'blue'
    };
    return allColor[status];
  }, [status]);

  return (
    <>
      <BasicTag size="small" color={color as BasicTagColor}>
        {t(`sqlManagement.table.filter.status.${status}`)}
      </BasicTag>
    </>
  );
};

export default StatusTag;
