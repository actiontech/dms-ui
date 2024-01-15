import {
  IconOrderFileUpload,
  IconOrderSQLUpload
} from '../../../../icon/Order';
import { SettingOutlined } from '@ant-design/icons';
import { TypeUploadKeys } from './index.type';
import { t } from '../../../../locale/index';

export const uploadItem: {
  [key in TypeUploadKeys]: {
    icon: React.ReactNode;
    title: string;
  };
} = {
  sql: {
    icon: <IconOrderSQLUpload />,
    title: t('sqlAudit.create.sqlInfo.uploadTypeEnum.sql')
  },
  git: {
    icon: <SettingOutlined style={{ color: '#c3c6cd' }} />,
    title: t('sqlAudit.create.sqlInfo.uploadTypeEnum.git')
  },
  sqlFile: {
    icon: <IconOrderFileUpload />,
    title: t('sqlAudit.create.sqlInfo.uploadTypeEnum.sqlFile')
  },
  mybatisFile: {
    icon: <IconOrderFileUpload />,
    title: t('sqlAudit.create.sqlInfo.uploadTypeEnum.mybatisFile')
  },
  zipFile: {
    icon: <IconOrderFileUpload />,
    title: t('sqlAudit.create.sqlInfo.uploadTypeEnum.zipFile')
  }
};
