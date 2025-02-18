import { ServiceFieldProps } from '../../index.type';
import { BasicSelect, BasicToolTip } from '@actiontech/shared';
import { DrawerFormIconWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { useTranslation } from 'react-i18next';
import { ServiceFieldStyleWrapper } from '../../style';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';

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
      <BasicSelect
        {...otherProps}
        disabled={disabled}
        value={value}
        allowClear
        showSearch
        filterOption={filterOptionByLabel}
      />
      <BasicToolTip title={t('databaseAccount.create.form.syncDatabase')}>
        <DrawerFormIconWrapper
          style={{ marginLeft: '12px' }}
          onClick={onSyncService}
          disabled={!value || disabled}
          loading={syncServiceLoading}
          icon={
            <CommonIconStyleWrapper>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.6666 6.93337V2.20004C14.6666 1.80004 14.3333 1.46671 13.9333 1.46671H8.99992C8.59992 1.46671 8.26658 1.80004 8.26658 2.20004V6.93337C8.26658 7.33337 8.59992 7.66671 8.99992 7.66671H13.9333C14.3333 7.66671 14.6666 7.33337 14.6666 6.93337ZM2.06659 8.40004C1.66659 8.40004 1.33325 8.73337 1.33325 9.13337V13.8667C1.33325 14.2667 1.66659 14.6 2.06659 14.6H6.99992C7.39992 14.6 7.73325 14.2667 7.73325 13.8667V9.13337C7.73325 8.73337 7.39992 8.40004 6.99992 8.40004H2.06659ZM4.79992 5.20004H4.06659C4.06659 3.93337 5.13325 2.86671 6.39992 2.86671H6.66658C6.86658 2.86671 6.99992 2.73337 6.99992 2.53337V1.66671C6.99992 1.46671 6.86658 1.33337 6.66658 1.33337H6.39992C4.26659 1.33337 2.53325 3.06671 2.53325 5.20004H1.66659C1.53325 5.20004 1.46659 5.33337 1.46659 5.46671C1.46659 5.53337 1.46659 5.53337 1.53325 5.60004L2.99992 7.26671C3.13325 7.40004 3.33325 7.40004 3.46659 7.26671L4.93325 5.60004C4.99992 5.53337 4.99992 5.40004 4.93325 5.33337C4.86659 5.26671 4.86659 5.20004 4.79992 5.20004ZM11.1999 10.8H11.9333C11.9333 12.0667 10.8666 13.1334 9.59992 13.1334H9.33325C9.13325 13.1334 8.99992 13.2667 8.99992 13.4667V14.4C8.99992 14.6 9.13325 14.7334 9.33325 14.7334H9.59992C11.7333 14.7334 13.4666 13 13.4666 10.8667H14.3333C14.4666 10.8667 14.5333 10.8 14.5333 10.6667C14.5333 10.6 14.5333 10.6 14.4666 10.5334L12.9999 8.86671C12.8666 8.73337 12.6666 8.73337 12.5333 8.86671L11.0666 10.5334C10.9999 10.6 10.9999 10.7334 11.0666 10.8C11.0666 10.7334 11.1333 10.8 11.1999 10.8Z"
                  fill={
                    !value || syncServiceLoading ? 'currentColor' : '#4583FF'
                  }
                />
              </svg>
            </CommonIconStyleWrapper>
          }
        />
      </BasicToolTip>
    </ServiceFieldStyleWrapper>
  );
};

export default ServiceFiled;
