import { useTranslation } from 'react-i18next';
import {
  AuthAuditEventTypeEnum,
  AuthAuditEventDictionary
} from '../index.type';
import { useMemo } from 'react';

const useEventType = () => {
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

export default useEventType;
