import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Space } from 'antd5';
import { EmptyBox } from '@actiontech/shared';
import { AuditResultFilterContainerStyleWrapper } from '../style';

import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import { floatRound } from '@actiontech/shared/lib/utils/Math';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

interface IAuditResultInfo {
  score?: number;
  instanceSchemaName?: string;
  passRate?: number;
  auditLevel?: AuditTaskResV1AuditLevelEnum;
  bordered?: boolean;
  noPadding?: boolean;
}

const AuditResultInfo = (props: IAuditResultInfo) => {
  const { t } = useTranslation();
  const {
    score,
    passRate,
    instanceSchemaName,
    auditLevel,
    bordered = true,
    noPadding = false
  } = props;

  const auditLevelScoreCommonClass = useMemo(() => {
    return {
      'audit-level-normal':
        auditLevel === AuditTaskResV1AuditLevelEnum.normal || !auditLevel,
      'audit-level-error': auditLevel === AuditTaskResV1AuditLevelEnum.error,
      'audit-level-notice': auditLevel === AuditTaskResV1AuditLevelEnum.notice,
      'audit-level-warn': auditLevel === AuditTaskResV1AuditLevelEnum.warn
    };
  }, [auditLevel]);

  return (
    <AuditResultFilterContainerStyleWrapper
      className={classNames({
        'audit-result-filter-container-borderless': !bordered,
        'no-padding-style': noPadding
      })}
    >
      <Space className="audit-result-info" size={20}>
        <div className="audit-result-info-item">
          <EmptyBox if={typeof passRate === 'number'} defaultNode="-">
            <span
              className={classNames(
                'audit-result-info-item-value',
                auditLevelScoreCommonClass
              )}
            >
              {floatToPercent(passRate!)}%
            </span>
          </EmptyBox>

          <span className="audit-result-info-item-text">
            {t('audit.passRage')}
          </span>
        </div>
        <div className="audit-result-info-item">
          <EmptyBox if={typeof score === 'number'} defaultNode="-">
            <span
              className={classNames(
                'audit-result-info-item-value',
                auditLevelScoreCommonClass
              )}
            >
              {floatRound(score!)}
            </span>
          </EmptyBox>
          <span className="audit-result-info-item-text">
            {t('audit.source')}
          </span>
        </div>
        <EmptyBox if={!!instanceSchemaName}>
          <div className="audit-result-info-item">
            <span className="audit-result-info-item-schema-value">
              {instanceSchemaName}
            </span>
            <span className="audit-result-info-item-text">Schema</span>
          </div>
        </EmptyBox>
      </Space>
    </AuditResultFilterContainerStyleWrapper>
  );
};

export default AuditResultInfo;
