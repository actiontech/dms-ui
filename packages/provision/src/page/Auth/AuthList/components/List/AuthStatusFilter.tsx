import { AuthStatusDictionary } from './index.data';
import { AuthListAuthorizationFilterByStatusEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { useTranslation } from 'react-i18next';
import { BasicSegmented } from '@actiontech/shared';

const AuthStatusFilter: React.FC<{
  status: AuthListAuthorizationFilterByStatusEnum | 'all';
  onChange: (status: AuthListAuthorizationFilterByStatusEnum | 'all') => void;
}> = ({ status, onChange }) => {
  const { t } = useTranslation();
  return (
    <BasicSegmented
      value={status}
      onChange={(v) => {
        const key = v as typeof status;
        onChange(key);
      }}
      options={[
        'all',
        ...Object.keys(AuthListAuthorizationFilterByStatusEnum)
      ].map((v) => {
        const key = v as typeof status;
        return {
          label:
            key === 'all'
              ? t('common.all')
              : t(
                  AuthStatusDictionary[
                    AuthListAuthorizationFilterByStatusEnum[key]
                  ]
                ),
          value: key
        };
      })}
    />
  );
};

export default AuthStatusFilter;
