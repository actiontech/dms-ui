import { useTranslation } from 'react-i18next';
import { EditFilled } from '@actiontech/icons';
import { SystemConfigModifyBtnStyleWrapper } from './style';
import { BasicToolTip } from '../../../BasicToolTip';
import { BasicButtonProps } from '../../../BasicButton';

type Props = Omit<BasicButtonProps, 'type' | 'icon'>;

const ConfigModifyBtn: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  return (
    <BasicToolTip title={t('common.modify')} titleWidth={54}>
      <SystemConfigModifyBtnStyleWrapper
        {...props}
        type="text"
        icon={<EditFilled color="currentColor" />}
      />
    </BasicToolTip>
  );
};

export default ConfigModifyBtn;
