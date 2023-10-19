import i18n from 'i18next';

export const cronOptions = [
  {
    value: -1,
    label: i18n.t('common.time.everyDay')
  },
  {
    value: 0,
    label: i18n.t('common.week.sunday')
  },
  {
    value: 1,
    label: i18n.t('common.week.monday')
  },
  {
    value: 2,
    label: i18n.t('common.week.tuesday')
  },
  {
    value: 3,
    label: i18n.t('common.week.wednesday')
  },
  {
    value: 4,
    label: i18n.t('common.week.thursday')
  },
  {
    value: 5,
    label: i18n.t('common.week.friday')
  },
  {
    value: 6,
    label: i18n.t('common.week.saturday')
  }
];
