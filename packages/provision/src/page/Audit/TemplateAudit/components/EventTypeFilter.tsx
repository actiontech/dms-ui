import { useTranslation } from 'react-i18next';
import { BasicSegmented } from '@actiontech/shared';
import { AuditTemplateEventTypeDictionary } from '~/hooks/useStaticStatus/index.data';
import { EventTypeEnum } from './EventType';

interface EventTypeFilterProps {
  eventType: EventTypeEnum | 'all';
  onChange: (status: EventTypeEnum | 'all') => void;
}

const EventTypeFilter: React.FC<EventTypeFilterProps> = ({
  eventType,
  onChange
}) => {
  const { t } = useTranslation();
  return (
    <BasicSegmented
      value={eventType}
      onChange={(v) => {
        const key = v as typeof eventType;
        onChange(key);
      }}
      options={['all', ...Object.keys(EventTypeEnum)].map((v) => {
        const key = v as typeof eventType;
        return {
          label:
            key === 'all'
              ? t('common.all')
              : t(AuditTemplateEventTypeDictionary[EventTypeEnum[key]]),
          value: key
        };
      })}
    />
  );
};

export default EventTypeFilter;
