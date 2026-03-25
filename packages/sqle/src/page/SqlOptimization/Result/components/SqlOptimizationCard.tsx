import React, { useMemo } from 'react';
import { BasicEmpty } from '@actiontech/dms-kit';
import { SqlOptimizationCardWrapper } from './style';
import classNames from 'classnames';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useTranslation } from 'react-i18next';
import { normalizeOptimizationModuleState } from '../utils/optimizationModuleState';

export interface SqlOptimizationCardProps {
  title: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  errorMessage?: string;
  isEmpty?: boolean;
  optimizationStatus?: OptimizationSQLDetailStatusEnum;
  /** 对应模块的 state：running / done / failed */
  moduleState?: string;
}

const SqlOptimizationCard: React.FC<SqlOptimizationCardProps> = ({
  title,
  extra,
  children,
  className = '',
  errorMessage,
  isEmpty = false,
  optimizationStatus,
  moduleState
}) => {
  const { t } = useTranslation();
  const isEmptyOrError = isEmpty || !!errorMessage;
  const normalizedModule = normalizeOptimizationModuleState(moduleState);
  const moduleFailed = normalizedModule === 'failed';
  const moduleRunning = normalizedModule === 'running';

  const emptyCont = useMemo(() => {
    if (errorMessage) {
      return t('common.tip.no_data');
    }
    if (moduleFailed) {
      return t('sqlOptimization.result.moduleFailed');
    }
    if (optimizationStatus === OptimizationSQLDetailStatusEnum.optimizing) {
      return t('sqlOptimization.result.optimizing');
    }
    if (moduleRunning) {
      return t('sqlOptimization.result.moduleGenerating');
    }
    return t('common.tip.no_data');
  }, [errorMessage, moduleFailed, moduleRunning, optimizationStatus, t]);

  return (
    <SqlOptimizationCardWrapper
      title={title}
      className={classNames('sql-optimization-card', className)}
      extra={isEmptyOrError ? null : extra}
      bordered={false}
      size="small"
    >
      {isEmptyOrError ? (
        <BasicEmpty emptyCont={emptyCont} errorInfo={errorMessage} />
      ) : (
        children
      )}
    </SqlOptimizationCardWrapper>
  );
};

export default SqlOptimizationCard;
