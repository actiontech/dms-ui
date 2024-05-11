import { ModeSwitcherOptionsType } from '@actiontech/shared/lib/components/ModeSwitcher/index.type';
import { SQLInputType } from '.';
import { t } from '../../../locale';
import { IconOrderFileUpload, IconOrderSQLUpload } from '../../../icon/Order';

export const defaultUploadTypeOptions: ModeSwitcherOptionsType = [
  {
    icon: <IconOrderSQLUpload />,
    label: t('order.sqlInfo.manualInput'),
    value: SQLInputType.manualInput,
    colProps: {
      span: 8
    }
  },
  {
    icon: <IconOrderFileUpload />,
    label: t('order.sqlInfo.uploadFile'),
    value: SQLInputType.uploadFile,
    colProps: {
      span: 8
    }
  },
  // {
  //   icon: <IconOrderFileUpload />,
  //   label: t('order.sqlInfo.updateMybatisFile'),
  //   value: SQLInputType.uploadMybatisFile,
  //   colProps: {
  //     span: 8
  //   }
  // },
  {
    icon: <IconOrderFileUpload />,
    label: t('order.sqlInfo.uploadZipFile'),
    value: SQLInputType.zipFile,
    colProps: {
      span: 8
    }
  }
];
