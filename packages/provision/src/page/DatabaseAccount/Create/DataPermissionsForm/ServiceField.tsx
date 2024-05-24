import { ServiceFieldProps } from '../../index.type';
import { BasicSelect, BasicToolTips } from '@actiontech/shared';
import { DrawerFormIconWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { useTranslation } from 'react-i18next';
import { IconSyncDictionary } from '../../../../icon/AuthTemplate';
import { ServiceFieldStyleWrapper } from '../../style';

const ServiceFiled: React.FC<ServiceFieldProps> = ({
  value,
  syncServiceLoading,
  onSyncService,
  disabled,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <ServiceFieldStyleWrapper>
      <BasicSelect {...otherProps} disabled={disabled} value={value} />
      <BasicToolTips title={t('dataObject.syncDataSource.button')}>
        <DrawerFormIconWrapper
          style={{ marginLeft: '12px' }}
          onClick={onSyncService}
          disabled={!value || syncServiceLoading || disabled}
          icon={<IconSyncDictionary disabled={!value || syncServiceLoading} />}
        />
      </BasicToolTips>
    </ServiceFieldStyleWrapper>
  );
};

export default ServiceFiled;
