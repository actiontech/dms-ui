import { SettingOutlined } from '@ant-design/icons';
import { t } from '../../../../locale/index';
import { ModeSwitcherOptionsType } from '@actiontech/shared/lib/components/ModeSwitcher/index.type';
import { UploadTypeEnum } from '../SQLInfoForm/index.type';
import { FileUploadFilled, PanelCardOutlined } from '@actiontech/icons';

export const uploadTypeOptions: ModeSwitcherOptionsType = [
  {
    icon: <PanelCardOutlined width={18} height={18} />,
    label: t('sqlAudit.create.sqlInfo.uploadTypeEnum.sql'),
    value: UploadTypeEnum.sql,
    colProps: {
      span: 8
    }
  },
  {
    icon: <FileUploadFilled width={18} height={18} />,
    label: t('sqlAudit.create.sqlInfo.uploadTypeEnum.sqlFile'),
    value: UploadTypeEnum.sqlFile,
    colProps: {
      span: 8
    }
  },
  {
    icon: <FileUploadFilled width={18} height={18} />,
    label: t('sqlAudit.create.sqlInfo.uploadTypeEnum.mybatisFile'),
    value: UploadTypeEnum.mybatisFile,
    colProps: {
      span: 8
    }
  },
  {
    icon: <FileUploadFilled width={18} height={18} />,
    label: t('sqlAudit.create.sqlInfo.uploadTypeEnum.zipFile'),
    value: UploadTypeEnum.zipFile,
    colProps: {
      span: 8
    }
  },
  {
    icon: <SettingOutlined />,
    label: t('sqlAudit.create.sqlInfo.uploadTypeEnum.git'),
    value: UploadTypeEnum.git,
    colProps: {
      span: 8
    }
  }
];
