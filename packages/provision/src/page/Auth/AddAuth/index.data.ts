import i18n from 'i18next';

export const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 10 }
};

export const timeDayOptions = [
  {
    label: i18n.t('common.time.permanent'),
    value: -1
  },
  {
    label: i18n.t('common.time.oneYear'),
    value: 365
  },
  {
    label: i18n.t('common.time.oneMonth'),
    value: 30
  },
  {
    label: i18n.t('common.time.oneWeek'),
    value: 7
  }
];
