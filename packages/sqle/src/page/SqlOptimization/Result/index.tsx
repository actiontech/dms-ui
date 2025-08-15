import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import ResultContent from './components/ResultContent';

const SqlOptimizationResult: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={
          <BasicButton icon={<ArrowLeftOutlined />}>
            {t('sqlOptimization.result.viewOptimizationResult')}
          </BasicButton>
        }
        fixed
      />
      <ResultContent />
    </>
  );
};

export default SqlOptimizationResult;
