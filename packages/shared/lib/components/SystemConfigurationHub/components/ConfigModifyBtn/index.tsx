import { useTranslation } from 'react-i18next';
import { EditFilled } from '@actiontech/icons';
import BasicToolTips from '../../../BasicToolTips';
import { SystemConfigModifyBtnStyleWrapper } from './style';

const ConfigModifyBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <BasicToolTips title={t('common.modify')} titleWidth={54}>
      <SystemConfigModifyBtnStyleWrapper
        type="text"
        onClick={onClick}
        // todo 临时解决方案，考虑将 theme 全部移至 shared，解决以下问题
        // 1. 由于 theme 独立存在的原因， 所有项目都存在自己的 superRender 方法。
        // 2. 除了 shared 外，所有项目都存在自己的 useThemeStyleData hooks
        icon={<EditFilled color="#292c33" />}
      />
    </BasicToolTips>
  );
};

export default ConfigModifyBtn;
