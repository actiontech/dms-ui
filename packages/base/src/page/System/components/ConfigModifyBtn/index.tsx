import { useTranslation } from 'react-i18next';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { EditFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { useCurrentUser } from '@actiontech/shared/lib/global';

/**
 * @deprecated
 * 使用 shared 中 ConfigModifyBtn 替换
 */
const ConfigModifyBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = useTranslation();
  const { baseTheme } = useThemeStyleData();
  const { isAdmin } = useCurrentUser();

  if (!isAdmin) {
    return null;
  }

  return (
    <BasicToolTips title={t('common.modify')} titleWidth={54}>
      <BasicButton
        type="text"
        className="system-config-button"
        onClick={onClick}
        icon={<EditFilled color={baseTheme.icon.system.modify} />}
      />
    </BasicToolTips>
  );
};

export default ConfigModifyBtn;
