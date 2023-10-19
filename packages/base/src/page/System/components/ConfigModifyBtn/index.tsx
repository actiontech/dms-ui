import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { IconModify } from '../../../../icon/system';
import { useTranslation } from 'react-i18next';

const ConfigModifyBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <BasicToolTips title={t('common.modify')} titleWidth={54}>
      <BasicButton
        type="text"
        className="system-config-button"
        onClick={onClick}
        icon={<IconModify />}
      />
    </BasicToolTips>
  );
};

export default ConfigModifyBtn;
