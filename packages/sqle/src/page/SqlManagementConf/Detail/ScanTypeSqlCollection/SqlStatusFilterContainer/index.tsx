import { BasicButton, CustomSegmentedFilter } from '@actiontech/shared';
import { SqlStatusFilterContainerStyleWrapper } from './style';
import { SqlStatusFilterContainerProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

const SqlStatusFilterContainer: React.FC<SqlStatusFilterContainerProps> = ({
  auditAction,
  lastAuditTime,
  ...filterProps
}) => {
  const { t } = useTranslation();
  return (
    <SqlStatusFilterContainerStyleWrapper>
      <CustomSegmentedFilter
        {...filterProps}
        noStyle
        className="sql-status-filter-option"
      />

      <div className="sql-status-filter-extra">
        <BasicButton onClick={auditAction} type="primary">
          {t('managementConf.detail.scanTypeSqlCollection.action.urgentAudit')}
        </BasicButton>
        <div className="sql-status-filter-extra-tips">
          {t(
            'managementConf.detail.scanTypeSqlCollection.action.lastAuditTime',
            { time: formatTime(lastAuditTime, '-') }
          )}
        </div>
      </div>
    </SqlStatusFilterContainerStyleWrapper>
  );
};

export default SqlStatusFilterContainer;
