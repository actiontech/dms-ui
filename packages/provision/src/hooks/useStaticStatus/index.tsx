import { useTranslation } from 'react-i18next';
import { AuthAuditEventDictionary } from './index.data';
import { useMemo } from 'react';
import { AuthAuditEventTypeEnum } from '~/page/Audit/AuthAudit/index.type';

const useStaticStatus = () => {
  const { t } = useTranslation();

  const authAuditEventTypeOptions = useMemo(() => {
    return Object.keys(AuthAuditEventTypeEnum).map((i) => {
      const key = i as keyof typeof AuthAuditEventTypeEnum;
      return {
        label: t(AuthAuditEventDictionary[key]),
        value: i
      };
    });
  }, [t]);

  return {
    authAuditEventTypeOptions
  };
};

export default useStaticStatus;
