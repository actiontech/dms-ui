import React from 'react';
import { BasicEmpty } from '@actiontech/dms-kit';
import { SqlOptimizationCardWrapper } from './style';
import classNames from 'classnames';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useTranslation } from 'react-i18next';

export interface SqlOptimizationCardProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  errorMessage?: string;
  isEmpty?: boolean;
  optimizationStatus?: OptimizationSQLDetailStatusEnum;
}

const SqlOptimizationCard: React.FC<SqlOptimizationCardProps> = ({
  title,
  extra,
  children,
  className = '',
  errorMessage,
  isEmpty = false,
  optimizationStatus
}) => {
  const { t } = useTranslation();
  const isEmptyOrError = isEmpty || !!errorMessage;

  return (
    <SqlOptimizationCardWrapper
      title={title}
      className={classNames('sql-optimization-card', className)}
      extra={isEmptyOrError ? null : extra}
      bordered={false}
      size="small"
    >
      {isEmptyOrError ? (
        <BasicEmpty
          emptyCont={
            optimizationStatus === OptimizationSQLDetailStatusEnum.optimizing
              ? t('sqlOptimization.result.optimizing')
              : t('common.tip.no_data')
          }
          errorInfo={errorMessage}
        />
      ) : (
        children
      )}
    </SqlOptimizationCardWrapper>
  );
};

export default SqlOptimizationCard;
