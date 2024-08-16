import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { FormItemNoLabel } from '../../../FormCom';
import BasicButton from '../../../BasicButton';

interface ConfigSubmitButtonFieldProps {
  submitLoading: boolean;
  handleClickCancel: () => void;
}

const ConfigSubmitButtonField = ({
  submitLoading,
  handleClickCancel
}: ConfigSubmitButtonFieldProps) => {
  const { t } = useTranslation();
  return (
    <FormItemNoLabel label=" " colon={false}>
      <Space size={12}>
        <BasicButton disabled={submitLoading} onClick={handleClickCancel}>
          {t('common.cancel')}
        </BasicButton>
        <BasicButton
          htmlType="submit"
          type="primary"
          disabled={submitLoading}
          loading={submitLoading}
        >
          {t('common.submit')}
        </BasicButton>
      </Space>
    </FormItemNoLabel>
  );
};

export default ConfigSubmitButtonField;
