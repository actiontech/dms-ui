import { EditableSelect, EditableSelectProps } from '@actiontech/shared';
import React from 'react';
import { useTranslation } from 'react-i18next';

const EnvironmentField: React.FC<Omit<EditableSelectProps, 'options'>> = (
  props
) => {
  const { t } = useTranslation();
  return (
    <EditableSelect
      {...props}
      value={'1'}
      options={[
        { value: '1', label: '测试环境' },
        { value: '2', label: '预发环境' },
        { value: '3', label: '生产环境' }
      ]}
      addButtonText={t('dmsDataSource.dataSourceForm.addEnvironmentAttribute')}
      deletionConfirmTitle={t(
        'dmsDataSource.dataSourceForm.deleteEnvironmentAttributeConfirm'
      )}
    />
  );
};

export default EnvironmentField;
