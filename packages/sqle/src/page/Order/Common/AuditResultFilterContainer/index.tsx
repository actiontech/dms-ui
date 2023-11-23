import { Space } from 'antd';
import {
  AuditResultFilterContainerStyleWrapper,
  AuditResultFilterOptionsStyleWrapper
} from '../style';
import { AuditResultFilterContainerProps } from './index.type';
import { EmptyBox } from '@actiontech/shared';
import { useMemo } from 'react';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import classNames from 'classnames';
import { floatToPercent } from '@actiontech/shared/lib/utils/Math';
import { floatRound } from '@actiontech/shared/lib/utils/Math';
import { useTranslation } from 'react-i18next';

const AuditResultFilterContainer = <T extends string>(
  props: AuditResultFilterContainerProps<T>
) => {
  const { t } = useTranslation();
  const {
    filterOptions,
    score,
    passRate,
    instanceSchemaName,
    filterValue,
    filterValueChange,
    auditLevel,
    bordered = true
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
        'audit-result-filter-container-borderless': !bordered
      })}
    >
      <Space className="audit-result-filter-options">
        {filterOptions.map((v) => (
          <AuditResultFilterOptionsStyleWrapper
            onClick={() => filterValueChange(v.value)}
            active={filterValue === v.value}
            key={v.value}
          >
            {/* <span className="num">{v.num}</span> */}
            <span className="text">{v.label}</span>
          </AuditResultFilterOptionsStyleWrapper>
        ))}
      </Space>

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

export default AuditResultFilterContainer;
