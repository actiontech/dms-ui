import { useTranslation } from 'react-i18next';

import { Space } from 'antd';
import { BasicButton } from '@actiontech/shared';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';

interface ConfigSubmitButtonFieldProps {
  submitLoading: boolean;
  handleClickCancel: () => void;
}

/**
 * @deprecated
 * 使用 shared 中 ConfigSubmitButtonField 替换
 */
const ConfigSubmitButtonField = ({
  submitLoading,
  handleClickCancel
}: ConfigSubmitButtonFieldProps) => {
  const { t } = useTranslation();
  return (
    <>
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
    </>
  );
};

export default ConfigSubmitButtonField;
