import React from 'react';
import { BasicEmpty } from '@actiontech/shared';
import { SqlOptimizationCardWrapper } from './style';
import classNames from 'classnames';

export interface SqlOptimizationCardProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  errorMessage?: string;
  isEmpty?: boolean;
}

const SqlOptimizationCard: React.FC<SqlOptimizationCardProps> = ({
  title,
  extra,
  children,
  className = '',
  errorMessage,
  isEmpty = false
}) => {
  const isEmptyOrError = isEmpty || !!errorMessage;

  return (
    <SqlOptimizationCardWrapper
      title={title}
      className={classNames('sql-optimization-card', className)}
      extra={isEmptyOrError ? null : extra}
      bordered={false}
      size="small"
    >
      {isEmptyOrError ? <BasicEmpty errorInfo={errorMessage} /> : children}
    </SqlOptimizationCardWrapper>
  );
};

export default SqlOptimizationCard;
