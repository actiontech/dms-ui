import { BasicButton, Copy } from '@actiontech/dms-kit';
import { CheckboxMultipleBlankFilled } from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';

interface CopyButtonProps {
  content?: string;
  onlyIcon?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  content,
  onlyIcon = false
}) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <BasicButton
      icon={<CheckboxMultipleBlankFilled />}
      size="small"
      onClick={() => {
        Copy.copyTextByTextarea(content ?? '');
        messageApi.success(t('common.copied'));
      }}
      title={t('common.copy')}
    >
      {contextHolder}
      {!onlyIcon && t('common.copy')}
    </BasicButton>
  );
};

export default CopyButton;
