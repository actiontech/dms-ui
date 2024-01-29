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

  const statusText = {
    [SqlManageStatusEnum.ignored]: t(
      'sqlManagement.table.filter.status.ignored'
    ),
    [SqlManageStatusEnum.manual_audited]: t(
      'sqlManagement.table.filter.status.manual_audited'
    ),
    [SqlManageStatusEnum.solved]: t('sqlManagement.table.filter.status.solved'),
    [SqlManageStatusEnum.unhandled]: t(
      'sqlManagement.table.filter.status.unhandled'
    )
  };

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
        {statusText[status]}
      </BasicTag>
    </>
  );
};

export default StatusTag;
