import { EditableSelect } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';

interface EnvironmentFieldProps {
  value?: string;
  onChange?: (value: string) => void;
}

const EnvironmentField = (props: EnvironmentFieldProps) => {
  const { t } = useTranslation();
  return (
    <EditableSelect
      options={[
        { value: '1', label: '测试环境' },
        { value: '2', label: '预发环境' },
        { value: '3', label: '生产环境' }
      ]}
      addButtonText={t('dmsDataSource.dataSourceForm.addEnvironmentAttribute')}
      deletionConfirmTitle={t(
        'dmsDataSource.dataSourceForm.deleteEnvironmentAttributeConfirm'
      )}
      {...props}
    />
  );
};

export default EnvironmentField;
