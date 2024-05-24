import { SettingOutlined } from '@ant-design/icons';
import { t } from '../../../../locale/index';
import { ModeSwitcherOptionsType } from '@actiontech/shared/lib/components/ModeSwitcher/index.type';
import { UploadTypeEnum } from '../../index.type';
import {
  IconWorkflowFileUpload,
  IconWorkflowSQLUpload
} from '../../../../icon/SqlExecWorkflow';

export const uploadTypeOptions: ModeSwitcherOptionsType = [
  {
    icon: <IconWorkflowSQLUpload />,
    label: t('sqlAudit.create.sqlInfo.uploadTypeEnum.sql'),
    value: UploadTypeEnum.sql,
    colProps: {
      span: 8
    }
  },
  {
    icon: <IconWorkflowFileUpload />,
    label: t('sqlAudit.create.sqlInfo.uploadTypeEnum.sqlFile'),
    value: UploadTypeEnum.sqlFile,
    colProps: {
      span: 8
    }
  },
  {
    icon: <IconWorkflowFileUpload />,
    label: t('sqlAudit.create.sqlInfo.uploadTypeEnum.mybatisFile'),
    value: UploadTypeEnum.mybatisFile,
    colProps: {
      span: 8
    }
  },
  {
    icon: <IconWorkflowFileUpload />,
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
