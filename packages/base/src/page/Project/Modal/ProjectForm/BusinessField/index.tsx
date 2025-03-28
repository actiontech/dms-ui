import { EditableSelect } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';

interface BusinessSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const BusinessField = (props: BusinessSelectorProps) => {
  const { t } = useTranslation();
  return (
    <EditableSelect
      options={[
        { value: '1', label: '市场部' },
        { value: '2', label: '研发部' }
      ]}
      addButtonText={t('dmsProject.projectForm.addBusiness')}
      deletionConfirmTitle={t(
        'dmsProject.projectForm.deleteBusinessConfirmTitle'
      )}
      {...props}
    />
  );
};

export default BusinessField;
